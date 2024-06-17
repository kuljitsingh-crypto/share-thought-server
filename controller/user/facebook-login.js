const passport = require("passport");
const FacebookStrategy = require("passport-facebook");

const facebookClientId = process.env.FACEBOOK_LOGIN_ID;
const facebookClientSecret = process.env.FACEBOOK_LOGIN_SECRET;
const callbackURL = "/api/user/facebook-login/callback";

const strategyOption = {
  clientID: facebookClientId,
  clientSecret: facebookClientSecret,
  callbackURL: callbackURL,
  passReqToCallback: true,
  profileFields: ["id", "name", "emails", "picture"],
};

const verifyCallback = (request, accessToken, refreshToken, profile, done) => {
  const { first_name, last_name, picture, email, id } = profile._json;
  const pictureUrl = picture?.data?.url;
  const userData = {
    email: email,
    publicData: {
      profileImage: pictureUrl,
      firstName: first_name,
      lastName: last_name,
    },
    metadata: {
      adminOnly: {
        facebookId: id,
      },
    },
    thirdPartyProvider: "facebook",
    verified: true,
  };

  done(null, userData);
};

if (facebookClientId) {
  passport.use(new FacebookStrategy(strategyOption, verifyCallback));
}

module.exports.facebookAuthenticate = (req, res, next) => {
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })(req, res, next);
};

module.exports.facebookAuthenticateCallback = (req, res, next) => {
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/api/user/facebook-login",
  })(req, res, next);
};
