import { MailtrapClient } from "mailtrap";
import { configDotenv } from "dotenv";

configDotenv();

const SENDER_EMAIL = "hello@demomailtrap.com";

export const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

export const sender = { name: "Team Auth", email: SENDER_EMAIL };
