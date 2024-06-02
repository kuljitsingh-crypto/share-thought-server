module.exports.appBaseUrl = () => {
  const appBaseUrl = process.env.APP_URL;
  if (appBaseUrl === undefined) {
    throw new Error("appBaseUrl is required");
  }
  return appBaseUrl;
};
