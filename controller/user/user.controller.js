const { emailVerifyMessage } = require("../../mailMessages");
const { emailAuth, appBaseUrl, sendEmail } = require("../../utill");
const { generateAuthVerificationToken } = emailAuth.helpers();
const TOKEN_EXPIRES_IN = "48h";

module.exports.defaultResponse = (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.getUserDetails = (req, res) => {
  console.log("request", req.query);

  res.send({ user: true });
};

module.exports.userLogin = (req, res) => {
  try {
    res.status(200).json({ csrfToken: req.csrfToken });
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.userSignup = async (req, res) => {
  try {
    const user = req.user;
    const { shortToken } = await generateAuthVerificationToken({
      id: user.id,
      expiresIn: TOKEN_EXPIRES_IN,
    });
    const tokenVerifyLink = `${appBaseUrl()}/api/user/email-verify?token=${shortToken}&email=${
      user.email
    }`;
    const { subject, text, html } = emailVerifyMessage({
      userName: user.publicData.firstName,
      link: tokenVerifyLink,
      hours: parseInt(TOKEN_EXPIRES_IN),
    });
    await sendEmail({ subject, text, html, to: user.email });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.currentUser = (req, res) => {
  try {
    console.log(req.user);
    res.status(200).send(req.user);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.sendCsrfToken = (req, res) => {
  try {
    res.status(200).json({ csrfToken: req.csrfToken });
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.userSignout = this.defaultResponse;

module.exports.emailVerify = this.defaultResponse;
