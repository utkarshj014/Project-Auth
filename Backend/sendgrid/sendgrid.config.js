// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";
import { configDotenv } from "dotenv";

configDotenv();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sgMailSend = async (msg) => {
  try {
    await sgMail.send(msg);
    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Error sending email!", error.response.body.errors);
    // Handle the error as needed
    throw new Error(`Error sending email: ${error.message}`);
  }
};

export default sgMailSend;
