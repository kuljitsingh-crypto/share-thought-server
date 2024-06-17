const { PlugableAuthentication } = require("plugable-authentication");
const mongoUri = process.env.MONGO_URI;
const collectionName = process.env.USER_COLLECTION_NAME;
const secrtKey = process.env.JWT_SECRET_KEY;
const encryptKey = process.env.ENCRYPTION_SECRET_KEY;
const cookieId = process.env.COOKIE_ID;

const emailAuth = new PlugableAuthentication({
  uri: mongoUri,
  collection: collectionName,
  cookieId,
  encryptSecret: encryptKey,
  jwtSecret: secrtKey,
  thirdPartyLoginOption: { google: {}, facebook: {} },
  disableIpMismatchValidation: true,
});

module.exports = emailAuth;
