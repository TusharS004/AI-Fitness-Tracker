import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config(); // Load .env variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);

export default twilioClient;
