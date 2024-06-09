const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { appBaseUrl } = require("../../utill");

const googleClientId = process.env.GOOGLE_LOGIN_ID;
const googleClientSecret = process.env.GOOGLE_LOGIN_SECRET;
const callbackUrl = `/api/user/google-login/callback`;
const strategyOption = {
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: callbackUrl,
  passReqToCallback: true,
};

const verifyCallback = (request, accessToken, refreshToken, profile, done) => {
  const { given_name, family_name, picture, email, email_verified } =
    profile._json;
  const userData = {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: given_name,
    lastName: family_name,
    verified: email_verified,
    email: email,
    picture: picture,
  };

  done(null, userData);
};

if (googleClientId) {
  passport.use(new GoogleStrategy(strategyOption, verifyCallback));
}

module.exports.googleAuthenticate = (req, res, next) => {
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })(req, res, next);
};

module.exports.googleAuthenticateCallback = (req, res, next) => {
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/user/google-login",
  })(req, res, next);
};
