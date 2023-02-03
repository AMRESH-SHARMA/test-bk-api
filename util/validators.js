import { check, header, body, query, param, validationResult } from 'express-validator'

export const vUserRegister = [
  body('userName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('username can not be empty')
    .bail(),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email can not be empty')
    .bail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vUsernameUnique = [
  check('userName')
    .notEmpty()
    .withMessage('userName can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vUserLogin = [
  check('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email can not be empty')
    .bail()
    .isEmail()
    .withMessage('invalid email')
    .bail(),
  check('password')
    .notEmpty()
    .withMessage('password can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vAdminLogin = [
  check('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email can not be empty')
    .bail()
    .isEmail()
    .withMessage('invalid email')
    .bail(),
  check('password')
    .notEmpty()
    .withMessage('password can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vAccessToken = [
  header('Authorization')
    .exists()
    .withMessage('access auth token does not exist')
    .bail()
    .notEmpty()
    .withMessage('access auth token can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vAddUser = [
  body('uniqueId')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('uniqueId can not be empty')
    .bail(),
  body('userName')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('userName can not be empty')
    .bail(),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('email can not be empty')
    .bail(),
  body('phone')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('phone can not be empty')
    .bail(),
  body('city')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('city can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vBookmark = [
  body('userId')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('userId can not be empty')
    .bail(),
  body('bookId')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('bookId can not be empty')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vParamId = [
  param('id')
    .exists()
    .withMessage('id param does not exist')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];

export const vUpdateStatus = [
  check('id')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('id can not be empty!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, msg: errors.mapped() });
    next();
  },
];