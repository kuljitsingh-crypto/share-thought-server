const {
  emailVerifyMessage,
  passwordResetMessage,
} = require("../../mailMessages");
const { emailAuth, appBaseUrl, sendEmail } = require("../../utill");
const { generateAuthVerificationToken, getUserDetails } = emailAuth.helpers();
const { signupMiddleware, loginMiddleware } = emailAuth.middlewares();
const TOKEN_EXPIRES_IN = "48h";
const platform = process.env.PLATFORM_NAME;

const encodeUserProfileImage = (profileImage) => {
  if (!!profileImage && typeof profileImage === "string")
    return encodeURIComponent(profileImage);
  return null;
};
const decodeUserProfileImage = (profileImage) => {
  if (!!profileImage && typeof profileImage === "string")
    return decodeURIComponent(profileImage);
  return null;
};
const processGoogleUserDataBeforeSignup = (req, res, next) => {
  const user = req.user;
  if (!user) res.status(401).send("Invalid details");
  const { googleId, firstName, lastName, email, picture, verified } = user;
  const signupData = {
    email,
    password: googleId,
    publicData: {
      firstName,
      lastName,
      profileImage: encodeUserProfileImage(picture),
    },
    verified,
  };
  req.body = signupData;
  next();
};

const googleSignupMiddlewareWrapper = async (req, res, next) => {
  const { verified, ...restBody } = req.body;
  const { email } = restBody;
  req.body = restBody;
  const savedUser = await getUserDetails({
    query: { auth: email },
    throwErrOnUserNotFound: false,
    userNotFoundMsg: "",
  });
  if (!savedUser) {
    signupMiddleware({ isCurrentUserVerified: verified })(req, res, next);
  } else {
    next();
  }
};

const processGoogleUserDataBeforeLogin = (req, res, next) => {
  const requestBody = req.body;
  const { email, password } = requestBody;
  req.body = { email, password };
  next();
};

const redirectUserAfterLogin = (req, res) => {
  res.redirect("/api/user/current-user");
};

module.exports.RESET_TOKEN_EXPIRES_IN = "2h";

module.exports.defaultResponse = (req, res) => {
  try {
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(e?.status || 500);
  }
};

module.exports.getUserDetails = (req, res) => {
  console.log("request", req.query);

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
    user.publicData.profileImage = decodeUserProfileImage(
      user.publicData.profileImage
    );
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

module.exports.googleLogin = [
  processGoogleUserDataBeforeSignup,
  googleSignupMiddlewareWrapper,
  processGoogleUserDataBeforeLogin,
  loginMiddleware(),
  redirectUserAfterLogin,
];
