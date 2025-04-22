from flask import Flask, Response, render_template, jsonify, request
import cv2
import mediapipe as mp
import numpy as np
import time
from datetime import timedelta
import threading
import queue
import os
import logging
from dataclasses import dataclass, asdict
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global variables for tracking state
global_frame = None
command_queue = queue.Queue()

@dataclass
class ExerciseState:
    count: int = 0
    exercise_type: str = "pushup"
    is_running: bool = False
    elapsed_time: str = "00:00:00"
    status: str = "PAUSED"
    confidence_score: float = 0.0
    form_feedback: str = "Waiting to detect form..."

# Initialize the global state
global_state = ExerciseState()

@dataclass
class ExerciseConfig:
    name: str
    angle_points: list
    up_threshold: int
    down_threshold: int
    secondary_angle_points: list = None  # For additional angle validation
    form_cues: dict = None  # Form cues and feedback

# Define exercises with enhanced configuration
EXERCISE_CONFIGS = {
    "pushup": ExerciseConfig(
        name="pushup",
        angle_points=[11, 13, 15],  # Right shoulder, elbow, wrist
        up_threshold=160,
        down_threshold=90,
        secondary_angle_points=[12, 14, 16],  # Left arm for symmetry check
        form_cues={
            "back_alignment": {
                "points": [11, 23, 27],  # Shoulder, hip, ankle
                "ideal_angle": 180,
                "tolerance": 15,
                "feedback": "Keep your back straight"
            },
            "elbow_position": {
                "points": [11, 13, 15],
                "ideal_angle": 90,
                "tolerance": 15,
                "feedback": "Lower to 90 degrees at elbow"
            }
        }
    ),
    "situp": ExerciseConfig(
        name="situp",
        angle_points=[11, 23, 25],  # Right shoulder, hip, knee
        up_threshold=170,
        down_threshold=130,
        form_cues={
            "neck_position": {
                "points": [9, 11, 13],  # Ear, shoulder, elbow
                "ideal_angle": 160,
                "tolerance": 20,
                "feedback": "Keep neck neutral, don't pull with head"
            }
        }
    ),
    "curlup": ExerciseConfig(
        name="curlup",
        angle_points=[11, 13, 15],  # Right shoulder, elbow, wrist
        up_threshold=160,
        down_threshold=60,
        secondary_angle_points=[12, 14, 16],  # Left arm for symmetry check
        form_cues={
            "elbow_path": {
                "points": [11, 13, 15],
                "ideal_angle": 90,
                "tolerance": 20,
                "feedback": "Keep elbows close to body"
            }
        }
    ),
    "squat": ExerciseConfig(
        name="squat",
        angle_points=[23, 25, 27],  # Right hip, knee, ankle
        up_threshold=170,
        down_threshold=90,
        secondary_angle_points=[24, 26, 28],  # Left leg for symmetry check
        form_cues={
            "knee_position": {
                "points": [23, 25, 27],
                "ideal_angle": 90,
                "tolerance": 15,
                "feedback": "Keep knees behind toes"
            },
            "back_angle": {
                "points": [11, 23, 25],
                "ideal_angle": 45,
                "tolerance": 15,
                "feedback": "Maintain back angle during squat"
            }
        }
    )
}

class PoseDetector:
    """
    Handles pose detection using MediaPipe Pose model
    """
    def __init__(self, 
                 static_image_mode=False, 
                 model_complexity=2,  # Increased for better accuracy
                 smooth_landmarks=True,
                 enable_segmentation=False,
                 min_detection_confidence=0.6,  # Increased for more stable detection
                 min_tracking_confidence=0.6):  # Increased for more stable tracking
        """
        Initialize pose detector with MediaPipe
        
        Args:
            static_image_mode: Whether to process as static images
            model_complexity: Model complexity (0, 1, or 2)
            smooth_landmarks: Whether to filter landmarks
            enable_segmentation: Whether to enable segmentation
            min_detection_confidence: Minimum confidence for detection
            min_tracking_confidence: Minimum confidence for tracking
        """
        self.static_image_mode = static_image_mode
        self.model_complexity = model_complexity
        self.smooth_landmarks = smooth_landmarks
        self.enable_segmentation = enable_segmentation
        self.min_detection_confidence = min_detection_confidence
        self.min_tracking_confidence = min_tracking_confidence
        
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        self.pose = self.mp_pose.Pose(
            static_image_mode=self.static_image_mode,
            model_complexity=self.model_complexity,
            smooth_landmarks=self.smooth_landmarks,
            enable_segmentation=self.enable_segmentation,
            min_detection_confidence=self.min_detection_confidence,
            min_tracking_confidence=self.min_tracking_confidence
        )
        
        self.landmark_list = []
        self.results = None
    
    def find_pose(self, img, draw=True):
        """
        Process image through MediaPipe Pose
        
        Args:
            img: Input image (BGR)
            draw: Whether to draw pose landmarks
            
        Returns:
            Processed image with landmarks drawn (if draw=True)
        """
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(img_rgb)
        
        if self.results.pose_landmarks and draw:
            # Enhanced drawing style
            self.mp_drawing.draw_landmarks(
                img, 
                self.results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style()
            )
        
        return img
    
    def find_position(self, img, draw=False):
        """
        Find position of all landmarks
        
        Args:
            img: Input image
            draw: Whether to draw landmark points
            
        Returns:
            List of landmark positions [id, x, y, visibility]
        """
        self.landmark_list = []
        if self.results and self.results.pose_landmarks:
            h, w, c = img.shape
            for id, lm in enumerate(self.results.pose_landmarks.landmark):
                cx, cy = int(lm.x * w), int(lm.y * h)
                self.landmark_list.append([id, cx, cy, lm.visibility])
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 0), cv2.FILLED)
        
        return self.landmark_list
    
    def find_angle(self, img, p1, p2, p3, draw=True):
        """
        Calculate angle between three points
        
        Args:
            img: Input image
            p1, p2, p3: Point indices (p2 is the vertex)
            draw: Whether to draw angle visualization
            
        Returns:
            Angle in degrees
        """
        if len(self.landmark_list) <= max(p1, p2, p3):
            return 0
            
        # Get landmarks
        x1, y1 = self.landmark_list[p1][1:3]
        x2, y2 = self.landmark_list[p2][1:3]
        x3, y3 = self.landmark_list[p3][1:3]
        
        # Calculate angle
        angle = np.degrees(np.arctan2(y3 - y2, x3 - x2) - np.arctan2(y1 - y2, x1 - x2))
        if angle < 0:
            angle += 360
            
        # Keep angle between 0-180
        if angle > 180:
            angle = 360 - angle
        
        # Draw
        if draw:
            # Draw lines between points
            cv2.line(img, (x1, y1), (x2, y2), (255, 255, 255), 3)
            cv2.line(img, (x3, y3), (x2, y2), (255, 255, 255), 3)
            
            # Draw circles at points
            cv2.circle(img, (x1, y1), 10, (0, 0, 255), cv2.FILLED)
            cv2.circle(img, (x2, y2), 10, (0, 255, 0), cv2.FILLED)
            cv2.circle(img, (x3, y3), 10, (0, 0, 255), cv2.FILLED)
            
            # Add outlines for better visibility
            cv2.circle(img, (x1, y1), 15, (0, 0, 255), 2)
            cv2.circle(img, (x2, y2), 15, (0, 255, 0), 2)
            cv2.circle(img, (x3, y3), 15, (0, 0, 255), 2)
            
            # Display angle
            cv2.putText(img, f'{int(angle)}°', (x2 - 50, y2 + 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        return angle
        
    def check_visibility(self, landmark_indices, threshold=0.65):
        """
        Check if specified landmarks are visible enough
        
        Args:
            landmark_indices: List of landmark indices to check
            threshold: Minimum visibility score
            
        Returns:
            Boolean indicating if landmarks are sufficiently visible
        """
        if not self.landmark_list:
            return False
            
        for idx in landmark_indices:
            if idx >= len(self.landmark_list) or self.landmark_list[idx][3] < threshold:
                return False
        return True
        
    def check_form(self, img, form_cue):
        """
        Check exercise form based on angle between points
        
        Args:
            img: Input image
            form_cue: Dictionary with form check parameters
            
        Returns:
            (is_good_form, angle, feedback)
        """
        points = form_cue["points"]
        ideal_angle = form_cue["ideal_angle"]
        tolerance = form_cue["tolerance"]
        feedback = form_cue["feedback"]
        
        # Skip if any point is not visible
        if not self.check_visibility(points):
            return None, 0, ""
            
        # Calculate the angle
        angle = self.find_angle(img, *points, draw=False)
        
        # Check if within tolerance
        is_good_form = abs(angle - ideal_angle) <= tolerance
        
        return is_good_form, angle, feedback if not is_good_form else "Good form"

class FitnessTracker:
    """
    Main class for tracking fitness exercises
    """
    def __init__(self):
        """Initialize the fitness tracker"""
        self.detector = PoseDetector()
        self.count = 0
        self.dir = 0  # 0 for going down, 1 for going up
        self.exercise_type = "pushup"  # Default exercise
        self.is_running = False
        self.start_time = None
        self.elapsed_time = timedelta(0)
        self.prev_time = 0
        self.confidence_score = 0.0
        self.form_feedback = "Waiting to detect form..."
        self.rep_history = []  # Store data about each rep for analysis
        self.display_debug = False  # Toggle for debug visualization
        
        # Rep detection state
        self.position_buffer = []  # Buffer for smoothing angle values
        self.buffer_size = 5
        self.rep_started = False
        self.rep_stage = "waiting"  # waiting, down, up
        self.last_angle = 0
        
    def get_exercise_config(self):
        """Get configuration for current exercise type"""
        return EXERCISE_CONFIGS.get(self.exercise_type, EXERCISE_CONFIGS["pushup"])
    
    def process_frame(self, img):
        """
        Process a video frame for exercise tracking
        
        Args:
            img: Input frame from camera
            
        Returns:
            Processed frame with overlays
        """
        if img is None or img.size == 0:
            logger.warning("Empty frame received")
            return np.zeros((480, 640, 3), dtype=np.uint8)
            
        # Flip image for more intuitive viewing
        img = cv2.flip(img, 1)
        
        # Get original dimensions for overlay positioning
        h, w, c = img.shape
        
        try:
            # Find pose landmarks
            img = self.detector.find_pose(img)
            self.detector.find_position(img)
            
            # Calculate current FPS
            current_time = time.time()
            fps = 1 / (current_time - self.prev_time) if self.prev_time > 0 else 0
            self.prev_time = current_time
            
            # Overlay semi-transparent background for UI elements
            overlay = img.copy()
            cv2.rectangle(overlay, (0, 0), (w, 130), (0, 0, 0), -1)
            cv2.rectangle(overlay, (0, h-60), (w, h), (0, 0, 0), -1)
            img = cv2.addWeighted(overlay, 0.3, img, 0.7, 0)
            
            if len(self.detector.landmark_list) > 0:
                exercise_config = self.get_exercise_config()
                
                # Primary angle detection
                p1, p2, p3 = exercise_config.angle_points
                up_threshold = exercise_config.up_threshold
                down_threshold = exercise_config.down_threshold
                
                # Check if required points are visible
                key_points = exercise_config.angle_points.copy()
                if exercise_config.secondary_angle_points:
                    key_points.extend(exercise_config.secondary_angle_points)
                
                if all(point < len(self.detector.landmark_list) for point in key_points):
                    # Calculate primary angle
                    angle = self.detector.find_angle(img, p1, p2, p3)
                    
                    # Add to buffer for smoothing
                    self.position_buffer.append(angle)
                    if len(self.position_buffer) > self.buffer_size:
                        self.position_buffer.pop(0)
                    
                    # Calculate smoothed angle
                    smoothed_angle = sum(self.position_buffer) / len(self.position_buffer)
                    
                    # Calculate secondary angle for symmetry check if available
                    symmetry_score = 1.0
                    if exercise_config.secondary_angle_points:
                        s1, s2, s3 = exercise_config.secondary_angle_points
                        sec_angle = self.detector.find_angle(img, s1, s2, s3, draw=False)
                        # Calculate symmetry score (1.0 = perfect symmetry)
                        angle_diff = abs(angle - sec_angle)
                        symmetry_score = max(0, 1.0 - (angle_diff / 180))
                    
                    # Convert angle to rep percentage
                    percentage = np.interp(smoothed_angle, (down_threshold, up_threshold), (0, 100))
                    
                    # Check form
                    form_issues = []
                    if exercise_config.form_cues:
                        for cue_name, cue_params in exercise_config.form_cues.items():
                            is_good, measured_angle, feedback = self.detector.check_form(img, cue_params)
                            if is_good is False:  # Explicitly check for False (not None)
                                form_issues.append(feedback)
                    
                    self.form_feedback = ", ".join(form_issues) if form_issues else "Good form"
                    
                    # Calculate overall confidence score based on visibility and symmetry
                    visibility_scores = [self.detector.landmark_list[p][3] for p in key_points 
                                         if p < len(self.detector.landmark_list)]
                    avg_visibility = sum(visibility_scores) / len(visibility_scores) if visibility_scores else 0
                    
                    # Combined score (70% visibility, 30% symmetry)
                    self.confidence_score = (0.7 * avg_visibility + 0.3 * symmetry_score) * 100
                    
                    # Count reps with improved detection algorithm
                    if self.is_running:
                        # Get elapsed time
                        if self.start_time:
                            self.elapsed_time = timedelta(seconds=int(time.time() - self.start_time))
                        
                        # Rep detection state machine
                        if percentage <= 10 and self.rep_stage != "down":
                            self.rep_stage = "down"
                        elif percentage >= 90 and self.rep_stage == "down":
                            self.rep_stage = "up"
                            self.count += 1
                            
                            # Store rep data for analysis
                            self.rep_history.append({
                                "time": str(self.elapsed_time),
                                "confidence": self.confidence_score,
                                "form_issues": form_issues
                            })
                            
                            # Reset to waiting state
                            self.rep_stage = "waiting"
                    
                    # Draw exercise feedback
                    self.draw_exercise_feedback(img, percentage, smoothed_angle)
            
            # Draw UI elements
            self.draw_ui_elements(img, fps)
            
            # Update global state
            global_state.count = int(self.count)
            global_state.exercise_type = self.exercise_type
            global_state.is_running = self.is_running
            global_state.elapsed_time = str(self.elapsed_time).split('.')[0]
            global_state.status = "RUNNING" if self.is_running else "PAUSED"
            global_state.confidence_score = self.confidence_score
            global_state.form_feedback = self.form_feedback
            
        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            cv2.putText(img, "Error processing frame", (10, h//2),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        return img
        
    def draw_exercise_feedback(self, img, percentage, angle):
        """
        Draw exercise-specific feedback on frame
        
        Args:
            img: Input image
            percentage: Exercise completion percentage
            angle: Current angle
        """
        h, w, c = img.shape
        
        # Draw progress bar
        bar_color = (0, 255, 0) if self.is_running else (0, 165, 255)
        cv2.rectangle(img, (w-200, 40), (w-40, 70), (255, 255, 255), 2)
        filled_width = int(160 * (percentage / 100))
        cv2.rectangle(img, (w-200, 40), (w-200 + filled_width, 70), bar_color, cv2.FILLED)
        cv2.putText(img, f"{int(percentage)}%", (w-190, 65),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        
        # Draw form feedback
        if self.form_feedback:
            feedback_color = (0, 255, 0) if self.form_feedback == "Good form" else (0, 0, 255)
            cv2.putText(img, self.form_feedback, (10, h-30),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, feedback_color, 2)
        
        # Draw confidence score
        confidence_color = (0, 255, 0) if self.confidence_score > 80 else \
                          (0, 165, 255) if self.confidence_score > 60 else (0, 0, 255)
        cv2.putText(img, f"Detection: {int(self.confidence_score)}%", (10, h-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, confidence_color, 2)
        
        # Add rep stage indicator
        stage_color = (0, 255, 0) if self.rep_stage == "up" else \
                     (0, 165, 255) if self.rep_stage == "down" else (255, 255, 255)
        cv2.putText(img, f"Stage: {self.rep_stage.upper()}", (w-200, h-10),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, stage_color, 2)
    
    def draw_ui_elements(self, img, fps):
        """
        Draw UI elements on the frame
        
        Args:
            img: Input image
            fps: Current frames per second
        """
        h, w, c = img.shape
        
        # Exercise type
        cv2.putText(img, f'Exercise: {self.exercise_type.upper()}', (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        
        # Rep counter with larger font
        cv2.putText(img, f'Reps: {int(self.count)}', (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
        
        # Timer
        time_str = str(self.elapsed_time).split('.')[0]
        cv2.putText(img, f'Time: {time_str}', (10, 110),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
        
        # Status with colored indicator
        status = "RUNNING" if self.is_running else "PAUSED"
        status_color = (0, 255, 0) if self.is_running else (0, 0, 255)
        cv2.putText(img, status, (w - 150, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)
        
        # FPS counter (smaller and in corner)
        cv2.putText(img, f'FPS: {int(fps)}', (w - 100, h - 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    def toggle_start_stop(self):
        """Toggle between start and stop states"""
        self.is_running = not self.is_running
        if self.is_running:
            if self.start_time is None:
                self.start_time = time.time()
            else:
                # Adjust start time to account for pause time
                pause_duration = time.time() - (self.start_time + self.elapsed_time.total_seconds())
                self.start_time += pause_duration
        logger.info(f"Exercise tracking {'started' if self.is_running else 'paused'}")
    
    def reset(self):
        """Reset tracking state"""
        self.count = 0
        self.dir = 0
        self.elapsed_time = timedelta(0)
        self.start_time = time.time() if self.is_running else None
        self.rep_history = []
        self.position_buffer = []
        self.rep_stage = "waiting"
        logger.info("Exercise tracking reset")
    
    def change_exercise(self, exercise_type):
        """
        Change the current exercise type
        
        Args:
            exercise_type: New exercise type
        """
        if exercise_type in EXERCISE_CONFIGS:
            self.exercise_type = exercise_type
            # Reset tracking state for new exercise
            self.reset()
            logger.info(f"Exercise changed to {exercise_type}")
        else:
            logger.warning(f"Invalid exercise type: {exercise_type}")
    
    def toggle_debug(self):
        """Toggle debug visualization mode"""
        self.display_debug = not self.display_debug
        logger.info(f"Debug mode {'enabled' if self.display_debug else 'disabled'}")
    
    def get_exercise_stats(self):
        """Get statistics about the current exercise session"""
        return {
            "count": int(self.count),
            "time": str(self.elapsed_time).split('.')[0],
            "exercise_type": self.exercise_type,
            "avg_confidence": sum([rep["confidence"] for rep in self.rep_history]) / len(self.rep_history) if self.rep_history else 0,
            "rep_history": self.rep_history
        }

def generate_frames():
    """Generator function to yield video frames"""
    cap = cv2.VideoCapture(0)
    # Set resolution to improve performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    tracker = FitnessTracker()
    
    try:
        while True:
            # Check for commands in the queue
            try:
                command = command_queue.get_nowait()
                if command == "start_stop":
                    tracker.toggle_start_stop()
                elif command == "reset":
                    tracker.reset()
                elif command == "toggle_debug":
                    tracker.toggle_debug()
                elif command.startswith("exercise_"):
                    exercise_type = command.split("_")[1]
                    tracker.change_exercise(exercise_type)
            except queue.Empty:
                pass
            
            # Read frame
            success, frame = cap.read()
            if not success:
                logger.error("Failed to capture frame")
                # Generate blank frame
                frame = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(frame, "Camera Error", (200, 240),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
            # Process the frame
            processed_frame = tracker.process_frame(frame)
            
            # Store the frame globally
            global global_frame
            global_frame = processed_frame
            
            # Convert to JPEG for streaming
            ret, buffer = cv2.imencode('.jpg', processed_frame)
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            
            yield (b'--frame\r\n'
                  b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    except Exception as e:
        logger.error(f"Error in frame generation: {e}")
    finally:
        cap.release()

# Flask Routes
@app.route('/')
def index():
    """Render main application page"""
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_stop')
def start_stop():
    """API endpoint to start/stop exercise tracking"""
    command_queue.put("start_stop")
    return jsonify({"status": "success"})

@app.route('/reset')
def reset():
    """API endpoint to reset exercise tracking"""
    command_queue.put("reset")
    return jsonify({"status": "success"})

@app.route('/toggle_debug')
def toggle_debug():
    """API endpoint to toggle debug visualization"""
    command_queue.put("toggle_debug")
    return jsonify({"status": "success"})

@app.route('/exercise/<exercise_type>')
def change_exercise(exercise_type):
    """API endpoint to change exercise type"""
    if exercise_type in EXERCISE_CONFIGS:
        command_queue.put(f"exercise_{exercise_type}")
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Invalid exercise type"})

@app.route('/get_state')
def get_state():
    """API endpoint to get current state"""
    return jsonify(asdict(global_state))

@app.route('/get_stats')
def get_stats():
    """API endpoint to get exercise statistics"""
    # This would need to be modified to access tracker's stats
    return jsonify({
        "count": global_state.count,
        "time": global_state.elapsed_time,
        "exercise_type": global_state.exercise_type,
        "confidence_score": global_state.confidence_score,
        "form_feedback": global_state.form_feedback
    })

@app.route('/available_exercises')
def available_exercises():
    """API endpoint to get available exercises"""
    return jsonify({
        "exercises": list(EXERCISE_CONFIGS.keys())
    })

def create_templates():
    """Create templates directory and HTML file"""
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    with open('templates/index.html', 'w') as f:
        f.write('''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ML Fitness Tracker</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --primary: #4361ee;
            --success: #38b000;
            --warning: #ff9500;
            --danger: #ef233c;
            --dark: #212529;
            --light: #f8f9fa;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f4f8;
            color: var(--dark);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: var(--primary);
            color: white;
            padding: 15px 0;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        h1 {
            text-align: center;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        
        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        @media (min-width: 992px) {
            .content-wrapper {
                flex-direction: row;
            }
        }
        
        .video-container {
            flex: 1;
            background-color: #000;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .video-container img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .controls-container {
            flex: 0 0 300px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .panel {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .panel-header {
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .panel-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        button {
            padding: 10px;
            font-size: 15px;
            cursor: pointer;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 4px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        button:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }
        
        button:active {
            transform: translateY(1px);
        }
        
        .btn-start-stop {
            grid-column: span 2;
        }
        
        .btn-start-stop.running {
            background-color: var(--danger);
        }
        
        .btn-reset {
            background-color: var(--warning);
        }
        
        .btn-debug {
            background-color: var(--dark);
        }
        
        .exercise-btn {
            background-color: var(--success);
        }
        
        .stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .stat {
            text-align: center;
        }
        
        .stat-value {
            font-size: 26px;
            font-weight: bold;
            margin: 5px 0;
            color: var(--primary);
        }
        
        .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
        }
        
        .progress-container {
            margin-top: 10px;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .progress-bar {
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary);
            border-radius: 5px;
            transition: width 0.3s ease;
        }
        
        .feedback {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            font-size: 14px;
            color: var(--dark);
            background-color: #f0f4f8;
        }
        
        .feedback.good {
            background-color: rgba(56, 176, 0, 0.1);
            color: var(--success);
        }
        
        .feedback.bad {
            background-color: rgba(239, 35, 60, 0.1);
            color: var(--danger);
        }
        
        .exercise-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .exercise-card {
            padding: 10px;
            border-radius: 4px;
            background-color: #f0f4f8;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        
        .exercise-card:hover {
            background-color: var(--primary);
            color: white;
        }
        
        .exercise-card.active {
            background-color: var(--primary);
            color: white;
            font-weight: bold;
        }
        
        footer {
            text-align: center;
            margin-top: 30px;
            padding: 10px 0;
            color: #666;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .controls {
                grid-template-columns: 1fr;
            }
            
            .btn-start-stop {
                grid-column: span 1;
            }
            
            .stats {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-heartbeat"></i> ML Fitness Tracker</h1>
        </header>
        
        <div class="content-wrapper">
            <div class="video-container">
                <img src="{{ url_for('video_feed') }}" alt="Fitness Tracker Video Feed">
            </div>
            
            <div class="controls-container">
                <div class="panel">
                    <div class="panel-header">
                        <h2 class="panel-title">Controls</h2>
                        <span id="status" class="badge">PAUSED</span>
                    </div>
                    <div class="controls">
                        <button id="startStopBtn" class="btn-start-stop">
                            <i class="fas fa-play"></i> Start
                        </button>
                        <button id="resetBtn" class="btn-reset">
                            <i class="fas fa-redo"></i> Reset
                        </button>
                        <button id="debugBtn" class="btn-debug">
                            <i class="fas fa-bug"></i> Debug
                        </button>
                    </div>
                </div>
                
                <div class="panel">
                    <div class="panel-header">
                        <h2 class="panel-title">Statistics</h2>
                    </div>
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-value" id="rep-count">0</div>
                            <div class="stat-label">Repetitions</div>
                        </div>
                        <div class="stat">
                            <div class="stat-value" id="elapsed-time">00:00:00</div>
                            <div class="stat-label">Time</div>
                        </div>
                    </div>
                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Detection Confidence</span>
                            <span id="confidence-value">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="confidence-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="feedback" id="form-feedback">
                        Waiting to detect form...
                    </div>
                </div>
                
                <div class="panel">
                    <div class="panel-header">
                        <h2 class="panel-title">Exercises</h2>
                    </div>
                    <div class="exercise-list" id="exercise-list">
                        <div class="exercise-card active" data-exercise="pushup">
                            <i class="fas fa-dumbbell"></i> Push-up
                        </div>
                        <div class="exercise-card" data-exercise="situp">
                            <i class="fas fa-dumbbell"></i> Sit-up
                        </div>
                        <div class="exercise-card" data-exercise="curlup">
                            <i class="fas fa-dumbbell"></i> Curl-up
                        </div>
                        <div class="exercise-card" data-exercise="squat">
                            <i class="fas fa-dumbbell"></i> Squat
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <footer>
            &copy; 2025 ML Fitness Tracker - Powered by MediaPipe and Computer Vision
        </footer>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const startStopBtn = document.getElementById('startStopBtn');
            const resetBtn = document.getElementById('resetBtn');
            const debugBtn = document.getElementById('debugBtn');
            const exerciseCards = document.querySelectorAll('.exercise-card');
            const repCount = document.getElementById('rep-count');
            const elapsedTime = document.getElementById('elapsed-time');
            const status = document.getElementById('status');
            const formFeedback = document.getElementById('form-feedback');
            const confidenceBar = document.getElementById('confidence-bar');
            const confidenceValue = document.getElementById('confidence-value');
            
            // Start/Stop button
            startStopBtn.addEventListener('click', function() {
                fetch('/start_stop')
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });
            
            // Reset button
            resetBtn.addEventListener('click', function() {
                fetch('/reset')
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });
            
            // Debug button
            debugBtn.addEventListener('click', function() {
                fetch('/toggle_debug')
                    .then(response => response.json())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));
            });
            
            // Exercise type buttons
            exerciseCards.forEach(card => {
                card.addEventListener('click', function() {
                    const exerciseType = this.getAttribute('data-exercise');
                    
                    // Remove active class from all cards
                    exerciseCards.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked card
                    this.classList.add('active');
                    
                    fetch(`/exercise/${exerciseType}`)
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.error('Error:', error));
                });
            });
            
            // Update stats
            function updateStats() {
                fetch('/get_state')
                    .then(response => response.json())
                    .then(data => {
                        // Update rep count
                        repCount.textContent = data.count;
                        
                        // Update elapsed time
                        elapsedTime.textContent = data.elapsed_time;
                        
                        // Update status
                        status.textContent = data.status;
                        
                        // Update form feedback
                        formFeedback.textContent = data.form_feedback;
                        
                        // Update form feedback styling
                        if (data.form_feedback === "Good form") {
                            formFeedback.className = "feedback good";
                        } else if (data.form_feedback === "Waiting to detect form...") {
                            formFeedback.className = "feedback";
                        } else {
                            formFeedback.className = "feedback bad";
                        }
                        
                        // Update confidence bar
                        const confidenceScore = data.confidence_score;
                        confidenceBar.style.width = `${confidenceScore}%`;
                        confidenceValue.textContent = `${Math.round(confidenceScore)}%`;
                        
                        // Set confidence bar color based on score
                        if (confidenceScore > 80) {
                            confidenceBar.style.backgroundColor = 'var(--success)';
                        } else if (confidenceScore > 60) {
                            confidenceBar.style.backgroundColor = 'var(--warning)';
                        } else {
                            confidenceBar.style.backgroundColor = 'var(--danger)';
                        }
                        
                        // Update exercise selection
                        exerciseCards.forEach(card => {
                            if (card.getAttribute('data-exercise') === data.exercise_type) {
                                card.classList.add('active');
                            } else {
                                card.classList.remove('active');
                            }
                        });
                        
                        // Update button based on status
                        if (data.status === 'RUNNING') {
                            startStopBtn.classList.add('running');
                            startStopBtn.innerHTML = '<i class="fas fa-pause"></i> Stop';
                        } else {
                            startStopBtn.classList.remove('running');
                            startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                        }
                    })
                    .catch(error => console.error('Error:', error));
            }
            
            // Update stats every second
            setInterval(updateStats, 1000);
            
            // Initial update
            updateStats();
            
            // Fetch available exercises from backend
            fetch('/available_exercises')
                .then(response => response.json())
                .then(data => {
                    // Create exercise cards dynamically if needed
                    // This is already handled in the HTML for the provided exercises
                })
                .catch(error => console.error('Error:', error));
        });
    </script>
</body>
</html>
        ''')

if __name__ == '__main__':
    # Create templates directory and index.html
    create_templates()
    
    # Log startup information
    logger.info("Starting ML Fitness Tracker application")
    logger.info(f"Available exercises: {', '.join(EXERCISE_CONFIGS.keys())}")
    
    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5001)