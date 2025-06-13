import { client, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: "Verify your email address",
      text: `Your verification code is ${verificationToken}`,
    });

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);

    throw new Error(`Error sending email: ${error.message}`);
  }
};
