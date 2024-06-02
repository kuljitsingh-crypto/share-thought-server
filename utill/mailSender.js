const nodeMailer = require("nodemailer");
const mailConfig = {
  service: "gmail",
  auth: {
    type: process.env.MAIL_TYPE,
    user: process.env.USER_MAIL,
    pass: process.env.USER_PASSWORD,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN,
  },
};
const transporter = nodeMailer.createTransport(mailConfig);

/**
 * @param {object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.html]
 *
 */
module.exports.sendEmail = async (options) => {
  try {
    const { to, subject, text, html } = options;
    const hasValidOptions =
      to &&
      typeof to === "string" &&
      subject &&
      typeof subject === "string" &&
      text &&
      typeof text === "string";
    if (!hasValidOptions) {
      throw new Error("Invalid mail options!");
    }
    await transporter.sendMail({
      to: to,
      subject,
      text,
      ...(html && typeof html === "string" ? { html } : {}),
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
