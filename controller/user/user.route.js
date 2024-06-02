const userRouter = require("express").Router();
const {
  getUserDetails,
  userLogin,
  userSignup,
  currentUser,
  sendCsrfToken,
  userSignout,
  emailVerify,
} = require("./user.controller");
const { emailAuth } = require("../../utill");
const {
  loginMiddleware,
  signupMiddleware,
  getCurrentUserMiddleware,
  newCsrfTokenMiddleware,
  logoutMiddleware,
  validateTokenForAuthVerificationMiddleware,
} = emailAuth.middlewares();

userRouter.get("/", getUserDetails);
userRouter.get("/logout", logoutMiddleware(), userSignout);
userRouter.get("/csrftoken", newCsrfTokenMiddleware(), sendCsrfToken);
userRouter.get("/current-user", getCurrentUserMiddleware(), currentUser);
userRouter.post("/login", loginMiddleware(), userLogin);
userRouter.post("/signup", signupMiddleware(), userSignup);
userRouter.post(
  "/email-verify",
  validateTokenForAuthVerificationMiddleware(),
  emailVerify
);
module.exports = userRouter;
