/**
 * @param {object} options
 * @param {string} options.userName
 * @param {string} options.platform
 * @param {string} options.link
 * @param {string|number} options.hour
 */
module.exports.passwordResetMessage = (options) => {
  const { userName, platform, link, hour } = options;
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Excel To HTML using codebeautify.org</title>
        <style>
          .textPara {
            padding: 8px 0px;
          }
    
          .btn {
            background-color: #007df2;
            padding: 16px 48px;
            border-radius: 8px;
            color: #fff;
            text-decoration: none !important;
          }
        </style>
      </head>
      <body>
        <div>
          <p>Hello ${userName},</p>
          <p class="textPara" style="padding-top:0px;">You have indicated that you have forgotten your password for ${platform}. Click the following link to reset your password:</p>
          <p>
            <a href=${link} class="btn" style="color:#fff;">Reset Password</a>
          </p>
          <p class="textPara" style="padding-bottom:0px;">If you don't use this link within ${hour} hour, it will expire. You can request a new password reset link, if you need to.</p>
          <p>If you didn't request this, please ignore this email. Your password won't be changed until you use the link above to set a new one.</p>
        </div>
      </body>
    </html>`;

  const subject = `Password reset instructions for ${platform}`;
  return { subject, text: subject, html };
};
