const userRouter = require("express").Router();
const {
  getUserDetails,
  userLogin,
  userSignup,
  currentUser,
  sendCsrfToken,
  userSignout,
  emailVerify,
  recoverPassword,
  RESET_TOKEN_EXPIRES_IN,
  resetPassword,
  appUserGoogleLogin,
  appUserFacebookLogin,
} = require("./user.controller");
const { emailAuth, appBaseUrl } = require("../../utill");
const {
  googleAuthenticate,
  googleAuthenticateCallback,
} = require("./google-login");
const {
  facebookAuthenticate,
  facebookAuthenticateCallback,
} = require("./facebook-login");
const {
  loginMiddleware,
  signupMiddleware,
  getCurrentUserMiddleware,
  newCsrfTokenMiddleware,
  logoutMiddleware,
  validateTokenForAuthVerificationMiddleware,
  resetPasswordMiddleware,
  resetPasswordVerifyMiddleware,
  thirdPartyLoginMiddleware,
} = emailAuth.middlewares();

userRouter.get("/", getUserDetails);
userRouter.get("/csrftoken", newCsrfTokenMiddleware(), sendCsrfToken);
userRouter.get("/current-user", getCurrentUserMiddleware(), currentUser);
userRouter.post("/login", loginMiddleware(), userLogin);
userRouter.post("/signup", signupMiddleware(), userSignup);
userRouter.get("/logout", logoutMiddleware(), userSignout);
userRouter.post(
  "/email-verify",
  validateTokenForAuthVerificationMiddleware(),
  emailVerify
);
userRouter.post(
  "/recover-password",
  resetPasswordMiddleware({ expiresIn: RESET_TOKEN_EXPIRES_IN }),
  recoverPassword
);
userRouter.post(
  "/reset-password",
  resetPasswordVerifyMiddleware(),
  resetPassword
);
userRouter.get("/google-login", googleAuthenticate);
userRouter.get(
  "/google-login/callback",
  googleAuthenticateCallback,
  thirdPartyLoginMiddleware({
    redirectpath: "/api/user/current-user",
  })
);
userRouter.post("/app/google-login", appUserGoogleLogin);
userRouter.get("/facebook-login", facebookAuthenticate);
userRouter.get(
  "/facebook-login/callback",
  facebookAuthenticateCallback,
  thirdPartyLoginMiddleware({
    redirectpath: "/api/user/current-user",
  })
);
userRouter.post("/app/facebook-login", appUserFacebookLogin);

module.exports = userRouter;
