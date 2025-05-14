import sgMailSend from "./sendgrid.config.js";

const from = {
  email: process.env.SENDGRID_VERIFIED_EMAIL,
  name: process.env.SENDGRID_SENDER,
};

export const sendVerificationEmail = async (
  email,
  fullName,
  verificationToken
) => {
  const msg = {
    to: email,
    from,
    template_id: process.env.VERIFICATION_EMAIL_TEMPLATEID,
    dynamic_template_data: {
      fullName,
      verificationToken,
    },
  };

  await sgMailSend(msg);
};

export const sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email,
    from,
    template_id: process.env.WELCOME_EMAIL_TEMPLATEID,
    dynamic_template_data: {
      name,
    },
  };

  await sgMailSend(msg);
};

export const sendPasswordResetEmail = async (email, resetPasswordURL) => {
  const msg = {
    to: email,
    from,
    template_id: process.env.PASSWORD_RESET_EMAIL_TEMPLATEID,
    dynamic_template_data: {
      resetPasswordURL,
    },
  };

  await sgMailSend(msg);
};

export const sendPasswordResetSuccessEmail = async (email, name) => {
  const msg = {
    to: email,
    from,
    subject: "Password reset successfully",
    text: `Hello ${name}, your password has been reset successfully! If you did not request this change, please contact support. Thank you!`,
    html: `<p>Hello ${name},</p><p>Your password has been reset successfully!</p><p>If you did not request this change, please contact support.</p> <p>Thank you!</p> `,
  };

  await sgMailSend(msg);
};
