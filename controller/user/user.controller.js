const { OAuth2Client } = require("google-auth-library");
const {
  emailVerifyMessage,
  passwordResetMessage,
} = require("../../mailMessages");
const { emailAuth, appBaseUrl, sendEmail } = require("../../utill");
const { default: axios } = require("axios");
const { generateAuthVerificationToken, thirdPartyLogin } = emailAuth.helpers();
const { signupMiddleware, loginMiddleware } = emailAuth.middlewares();
const TOKEN_EXPIRES_IN = "48h";
const platform = process.env.PLATFORM_NAME;
const googleLoginIdForApp = process.env.GOOGLE_APP_LOGIN_ID;
const facebookAppDataFetchUrl = process.env.FACEBOOK_APP_URL;

const googleAuthClient = new OAuth2Client();
module.exports.RESET_TOKEN_EXPIRES_IN = "2h";

module.exports.defaultResponse = (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.getUserDetails = (req, res) => {
  res.send({ user: req.query });
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
    const tokenVerifyLink = `${appBaseUrl()}/email-verify?token=${shortToken}&email=${
      user.email
    }`;
    const { subject, text, html } = emailVerifyMessage({
      userName: user.publicData.firstName,
      link: tokenVerifyLink,
      hours: parseInt(TOKEN_EXPIRES_IN),
      platform,
    });
    await sendEmail({ subject, text, html, to: user.email });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.currentUser = (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
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

module.exports.recoverPassword = async (req, res) => {
  try {
    const validationToken = req.validationToken;
    const user = req.user;
    const resetPwdLink = `${appBaseUrl()}/reset-password?token=${validationToken}&email=${
      user.email
    }`;
    const userName = user.publicData.firstName;
    const { subject, text, html } = passwordResetMessage({
      userName,
      link: resetPwdLink,
      platform,
      hour: parseInt(this.RESET_TOKEN_EXPIRES_IN),
    });
    await sendEmail({ to: user.email, subject, text, html });
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};
module.exports.resetPassword = async (req, res) => {
  try {
    const csrfToken = req.csrfToken;
    res.status(200).send({ csrfToken });
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.appUserGoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: idToken,
      audience: googleLoginIdForApp,
    });
    const payload = ticket.getPayload();
    const { sub, email, email_verified, picture, given_name, family_name } =
      payload;
    const userData = {
      email: email,
      publicData: {
        profileImage: picture,
        firstName: given_name,
        lastName: family_name,
      },
      metadata: {
        adminOnly: {
          googleId: sub,
        },
      },
      thirdPartyProvider: "google",
      verified: email_verified,
    };
    req.body = userData;
    const { csrfToken } = await thirdPartyLogin(req, res);
    res.status(200).send({ csrfToken });
  } catch (err) {
    const status = err.status || 500;
    if (err.message) {
      return res.status(status).send(err.message);
    }
    res.sendStatus(status);
  }
};

module.exports.appUserFacebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    const url = `${facebookAppDataFetchUrl}?fields=id,name,first_name,last_name,picture,email&access_token=${accessToken}`;
    const resp = await axios.get(url);
    const { id, first_name, last_name, email, picture } = resp.data;
    const userData = {
      email: email,
      publicData: {
        profileImage: picture?.data?.url || null,
        firstName: first_name,
        lastName: last_name,
      },
      metadata: {
        adminOnly: {
          googleId: id,
        },
      },
      thirdPartyProvider: "facebook",
      verified: true,
    };
    req.body = userData;
    const { csrfToken } = await thirdPartyLogin(req, res);
    res.status(200).send({ csrfToken });
  } catch (err) {
    console.log(err);
    const status = err.status || 500;
    if (err.message) {
      return res.status(status).send(err.message);
    }
    res.sendStatus(status);
  }
};
