const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:forgotPassword'); // eslint-disable-line no-unused-vars

const express = require('express');
const { body } = require('express-validator');
const { serializeUserSecurely } = require('../../models/serializers/user-serializer');

const router = express.Router();

module.exports = (crowi) => {
  const { appService, mailService, configManager } = crowi;
  const PasswordResetOrder = crowi.model('PasswordResetOrder');
  const User = crowi.model('User');
  const path = require('path');
  const csrf = require('../../middlewares/csrf')(crowi);
  const apiV3FormValidator = require('../../middlewares/apiv3-form-validator')(crowi);
  const passwordReset = require('../../middlewares/password-reset')(crowi);

  const validator = {
    password: [
      body('newPassword').isString().not().isEmpty()
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long'),
      // checking if password confirmation matches password
      body('newPasswordConfirm').isString().not().isEmpty()
        .custom((value, { req }) => {
          return (value === req.body.newPassword);
        }),
    ],
  };

  async function sendPasswordResetEmail(email, url, i18n) {
    return mailService.send({
      to: email,
      subject: 'Password Reset',
      template: path.join(crowi.localeDir, `${i18n}/notifications/passwordReset.txt`),
      vars: {
        appTitle: appService.getAppTitle(),
        email,
        url,
      },
    });
  }

  router.post('/', async(req, res) => {
    const { email } = req.body;
    const grobalLang = configManager.getConfig('crowi', 'app:globalLang');
    const i18n = req.language || grobalLang;
    const appUrl = appService.getSiteUrl();

    try {
      const user = await User.findOne({ email });

      // when the user is not found or active
      if (user == null || user.status !== 2) {
        return res.apiv3Err('User not found or active');
      }

      const passwordResetOrderData = await PasswordResetOrder.createPasswordResetOrder(email);
      const url = new URL(`/forgot-password/${passwordResetOrderData.token}`, appUrl);
      const oneTimeUrl = url.href;
      await sendPasswordResetEmail(email, oneTimeUrl, i18n);
      return res.apiv3();
    }
    catch (err) {
      const msg = 'Error occurred during password reset request procedure';
      logger.error(err);
      return res.apiv3Err(msg);
    }
  });

  router.put('/:token', csrf, passwordReset, validator.password, apiV3FormValidator, async(req, res) => {
    const passwordResetOrder = req.DataFromPasswordResetOrderMiddleware;
    const { newPassword } = req.body;

    const user = await User.findOne({ email: passwordResetOrder.email });

    // when the user is not found or active
    if (user == null || user.status !== 2) {
      return res.apiv3Err('update-password-failed');
    }

    try {
      const userData = await user.updatePassword(newPassword);
      const serializedUserData = serializeUserSecurely(userData);
      passwordResetOrder.isRevoked = true;
      return res.apiv3({ userData: serializedUserData });
    }
    catch (err) {
      logger.error(err);
      return res.apiv3Err('update-password-failed');
    }
  });

  return router;
};
