/**
 * @param {object} options
 * @param {string} options.userName
 * @param {string} options.link
 * @param {string|number} options.hours
 */
module.exports.emailVerifyMessage = (options) => {
  const { userName, link, hours } = options;
  const subject = "Email verification instructions";
  const msg = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify your email address</title>
    </head>
    <body>
      <div>
        <h1 style="color:#444;">Verify your email address</h1>
        <p style="font-size:20px;padding:16px 0px;">${userName}, to complete your signup to Share Thought, verify your email address by clicking the button below.</p>
        <p style="padding-bottom:16px;">
          <a href=${link} style="background-color:#007df2;padding:16px 48px;border-radius:8px;color:#fff;text-decoration:none !important;">Verify Email</a>
        </p>
        <p> Can't click the button? Here's the link for your convenience: ${link}. The link will expire in ${hours} hours. </p>
      </div>
    </body>
  </html>`;
  return { subject, text: subject, html: msg };
};
