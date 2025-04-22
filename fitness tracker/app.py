import streamlit as st
import cv2
import mediapipe as mp
import numpy as np
import time
from datetime import timedelta
import os
from dataclasses import dataclass

# Configure page
st.set_page_config(
    page_title="ML Fitness Tracker",
    page_icon="🏋️",
    layout="wide"
)

# Global variables
if 'count' not in st.session_state:
    st.session_state.count = 0
if 'is_running' not in st.session_state:
    st.session_state.is_running = False
if 'start_time' not in st.session_state:
    st.session_state.start_time = None
if 'elapsed_time' not in st.session_state:
    st.session_state.elapsed_time = timedelta(0)
if 'exercise_type' not in st.session_state:
    st.session_state.exercise_type = "pushup"
if 'form_feedback' not in st.session_state:
    st.session_state.form_feedback = "Waiting to detect form..."
if 'confidence_score' not in st.session_state:
    st.session_state.confidence_score = 0.0
if 'rep_stage' not in st.session_state:
    st.session_state.rep_stage = "waiting"
if 'position_buffer' not in st.session_state:
    st.session_state.position_buffer = []

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
                 model_complexity=2,
                 smooth_landmarks=True,
                 enable_segmentation=False,
                 min_detection_confidence=0.6,
                 min_tracking_confidence=0.6):
        """Initialize pose detector with MediaPipe"""
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        self.pose = self.mp_pose.Pose(
            static_image_mode=static_image_mode,
            model_complexity=model_complexity,
            smooth_landmarks=smooth_landmarks,
            enable_segmentation=enable_segmentation,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        
        self.landmark_list = []
        self.results = None
    
    def find_pose(self, img, draw=True):
        """Process image through MediaPipe Pose"""
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.pose.process(img_rgb)
        
        if self.results.pose_landmarks and draw:
            self.mp_drawing.draw_landmarks(
                img, 
                self.results.pose_landmarks, 
                self.mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style()
            )
        
        return img
    
    def find_position(self, img, draw=False):
        """Find position of all landmarks"""
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
        """Calculate angle between three points"""
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
        """Check if specified landmarks are visible enough"""
        if not self.landmark_list:
            return False
            
        for idx in landmark_indices:
            if idx >= len(self.landmark_list) or self.landmark_list[idx][3] < threshold:
                return False
        return True
        
    def check_form(self, img, form_cue):
        """Check exercise form based on angle between points"""
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

def process_frame(img, detector):
    """Process a video frame for exercise tracking"""
    if img is None or img.size == 0:
        return np.zeros((480, 640, 3), dtype=np.uint8)
        
    # Flip image for more intuitive viewing
    img = cv2.flip(img, 1)
    
    # Get original dimensions
    h, w, c = img.shape
    
    try:
        # Find pose landmarks
        img = detector.find_pose(img)
        detector.find_position(img)
        
        # Overlay semi-transparent background for UI elements
        overlay = img.copy()
        cv2.rectangle(overlay, (0, 0), (w, 130), (0, 0, 0), -1)
        cv2.rectangle(overlay, (0, h-60), (w, h), (0, 0, 0), -1)
        img = cv2.addWeighted(overlay, 0.3, img, 0.7, 0)
        
        if len(detector.landmark_list) > 0:
            exercise_config = EXERCISE_CONFIGS.get(st.session_state.exercise_type)
            
            # Primary angle detection
            p1, p2, p3 = exercise_config.angle_points
            up_threshold = exercise_config.up_threshold
            down_threshold = exercise_config.down_threshold
            
            # Check if required points are visible
            key_points = exercise_config.angle_points.copy()
            if exercise_config.secondary_angle_points:
                key_points.extend(exercise_config.secondary_angle_points)
            
            if all(point < len(detector.landmark_list) for point in key_points):
                # Calculate primary angle
                angle = detector.find_angle(img, p1, p2, p3)
                
                # Add to buffer for smoothing
                st.session_state.position_buffer.append(angle)
                if len(st.session_state.position_buffer) > 5:  # Buffer size
                    st.session_state.position_buffer.pop(0)
                
                # Calculate smoothed angle
                smoothed_angle = sum(st.session_state.position_buffer) / len(st.session_state.position_buffer)
                
                # Calculate secondary angle for symmetry check if available
                symmetry_score = 1.0
                if exercise_config.secondary_angle_points:
                    s1, s2, s3 = exercise_config.secondary_angle_points
                    sec_angle = detector.find_angle(img, s1, s2, s3, draw=False)
                    # Calculate symmetry score (1.0 = perfect symmetry)
                    angle_diff = abs(angle - sec_angle)
                    symmetry_score = max(0, 1.0 - (angle_diff / 180))
                
                # Convert angle to rep percentage
                percentage = np.interp(smoothed_angle, (down_threshold, up_threshold), (0, 100))
                
                # Check form
                form_issues = []
                if exercise_config.form_cues:
                    for cue_name, cue_params in exercise_config.form_cues.items():
                        is_good, measured_angle, feedback = detector.check_form(img, cue_params)
                        if is_good is False:  # Explicitly check for False (not None)
                            form_issues.append(feedback)
                
                st.session_state.form_feedback = ", ".join(form_issues) if form_issues else "Good form"
                
                # Calculate overall confidence score based on visibility and symmetry
                visibility_scores = [detector.landmark_list[p][3] for p in key_points 
                                     if p < len(detector.landmark_list)]
                avg_visibility = sum(visibility_scores) / len(visibility_scores) if visibility_scores else 0
                
                # Combined score (70% visibility, 30% symmetry)
                st.session_state.confidence_score = (0.7 * avg_visibility + 0.3 * symmetry_score) * 100
                
                # Count reps with improved detection algorithm
                if st.session_state.is_running:
                    # Get elapsed time
                    if st.session_state.start_time:
                        st.session_state.elapsed_time = timedelta(seconds=int(time.time() - st.session_state.start_time))
                    
                    # Rep detection state machine
                    if percentage <= 10 and st.session_state.rep_stage != "down":
                        st.session_state.rep_stage = "down"
                    elif percentage >= 90 and st.session_state.rep_stage == "down":
                        st.session_state.rep_stage = "up"
                        st.session_state.count += 1
                        
                        # Reset to waiting state
                        st.session_state.rep_stage = "waiting"
                
                # Draw progress bar
                bar_color = (0, 255, 0) if st.session_state.is_running else (0, 165, 255)
                cv2.rectangle(img, (w-200, 40), (w-40, 70), (255, 255, 255), 2)
                filled_width = int(160 * (percentage / 100))
                cv2.rectangle(img, (w-200, 40), (w-200 + filled_width, 70), bar_color, cv2.FILLED)
                cv2.putText(img, f"{int(percentage)}%", (w-190, 65),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
        
        # Draw UI elements
        draw_ui_elements(img, detector)
        
    except Exception as e:
        st.error(f"Error processing frame: {e}")
        cv2.putText(img, "Error processing frame", (10, h//2),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    
    return img

def draw_ui_elements(img, detector):
    """Draw UI elements on the frame"""
    h, w, c = img.shape
    
    # Exercise type
    cv2.putText(img, f'Exercise: {st.session_state.exercise_type.upper()}', (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    
    # Rep counter with larger font
    cv2.putText(img, f'Reps: {int(st.session_state.count)}', (10, 70),
                cv2.FONT_HERSHEY_SIMPLEX, 1.2, (255, 255, 255), 2)
    
    # Timer
    time_str = str(st.session_state.elapsed_time).split('.')[0]
    cv2.putText(img, f'Time: {time_str}', (10, 110),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
    
    # Status with colored indicator
    status = "RUNNING" if st.session_state.is_running else "PAUSED"
    status_color = (0, 255, 0) if st.session_state.is_running else (0, 0, 255)
    cv2.putText(img, status, (w - 150, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.9, status_color, 2)
    
    # Form feedback
    if st.session_state.form_feedback:
        feedback_color = (0, 255, 0) if st.session_state.form_feedback == "Good form" else (0, 0, 255)
        cv2.putText(img, st.session_state.form_feedback, (10, h-30),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, feedback_color, 2)
    
    # Draw confidence score
    confidence_color = (0, 255, 0) if st.session_state.confidence_score > 80 else \
                      (0, 165, 255) if st.session_state.confidence_score > 60 else (0, 0, 255)
    cv2.putText(img, f"Detection: {int(st.session_state.confidence_score)}%", (10, h-10),
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, confidence_color, 2)
    
    # Add rep stage indicator
    stage_color = (0, 255, 0) if st.session_state.rep_stage == "up" else \
                 (0, 165, 255) if st.session_state.rep_stage == "down" else (255, 255, 255)
    cv2.putText(img, f"Stage: {st.session_state.rep_stage.upper()}", (w-200, h-10),
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, stage_color, 2)

def toggle_start_stop():
    """Toggle between start and stop states"""
    st.session_state.is_running = not st.session_state.is_running
    if st.session_state.is_running:
        if st.session_state.start_time is None:
            st.session_state.start_time = time.time()
        else:
            # Adjust start time to account for pause time
            pause_duration = time.time() - (st.session_state.start_time + st.session_state.elapsed_time.total_seconds())
            st.session_state.start_time += pause_duration

def reset_tracker():
    """Reset tracking state"""
    st.session_state.count = 0
    st.session_state.elapsed_time = timedelta(0)
    st.session_state.start_time = time.time() if st.session_state.is_running else None
    st.session_state.position_buffer = []
    st.session_state.rep_stage = "waiting"

def change_exercise(exercise_type):
    """Change the current exercise type"""
    if exercise_type in EXERCISE_CONFIGS:
        st.session_state.exercise_type = exercise_type
        # Reset tracking state for new exercise
        reset_tracker()

# Main app layout
st.title("🏋️ ML Fitness Tracker")

# Sidebar controls
st.sidebar.header("Controls")
col1, col2 = st.sidebar.columns(2)
with col1:
    if st.button("▶️ Start" if not st.session_state.is_running else "⏸️ Pause"):
        toggle_start_stop()
with col2:
    if st.button("🔄 Reset"):
        reset_tracker()

# Exercise selection
st.sidebar.header("Exercise Selection")
exercise_options = list(EXERCISE_CONFIGS.keys())
selected_exercise = st.sidebar.selectbox(
    "Choose Exercise",
    exercise_options,
    index=exercise_options.index(st.session_state.exercise_type)
)
if selected_exercise != st.session_state.exercise_type:
    change_exercise(selected_exercise)

# Statistics panel
st.sidebar.header("Statistics")
stats_col1, stats_col2 = st.sidebar.columns(2)
with stats_col1:
    st.metric("Repetitions", st.session_state.count)
with stats_col2:
    st.metric("Time", str(st.session_state.elapsed_time).split('.')[0])

# Form feedback
st.sidebar.header("Form Feedback")
feedback_color = "green" if st.session_state.form_feedback == "Good form" else "red"
st.sidebar.markdown(f"<p style='color:{feedback_color};'>{st.session_state.form_feedback}</p>", unsafe_allow_html=True)

# Confidence meter
st.sidebar.header("Detection Confidence")
st.sidebar.progress(int(st.session_state.confidence_score)/100)
st.sidebar.text(f"{int(st.session_state.confidence_score)}%")

# Main content - video feed
video_placeholder = st.empty()

# Instructions
with st.expander("How to use"):
    st.markdown("""
    1. Allow camera access when prompted
    2. Position yourself so your full body is visible
    3. Select the exercise you want to perform
    4. Click Start to begin tracking
    5. Follow the form feedback to improve your technique
    """)

# Start webcam
detector = PoseDetector()
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

# Main app loop
try:
    while True:
        success, frame = cap.read()
        if not success:
            st.error("Failed to access webcam. Please check your camera permissions.")
            break
            
        # Process frame
        processed_frame = process_frame(frame, detector)
        
        # Display frame
        video_placeholder.image(cv2.cvtColor(processed_frame, cv2.COLOR_BGR2RGB), channels="RGB", use_column_width=True)
        
        # Add a small delay to reduce CPU usage
        time.sleep(0.03)
except Exception as e:
    st.error(f"Error: {e}")
finally:
    cap.release()