const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const userService = require("../services/user.service");

exports.signup = [
  body("email", "Email invalid").isLength({ max: 64 }).isEmail(),
  body("username", "Username must be alphanumeric and between 1-32 characters")
    .isLength({ min: 1, max: 32 })
    .isAlphanumeric(),
  body("password", "Password must be between 3-64 characters").isLength({ min: 3, max: 64 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors.array()[0].msg, status: 400 };
    }

    await userService.signup(req.body);

    res.status(201).json({ message: "Signed up successfully! Check your email to continue." });
  }),
];

exports.login = [
  body("usernameOrEmail")
    .isLength({ min: 1, max: 64 })
    .withMessage("Login must be between 1-64 characters")
    .matches(/^[a-z0-9\.\+\@]+$/i)
    .withMessage("Login must be alphanumeric or @ . + characters"),
  body("password", "Password must be between 3-64 characters").isLength({ min: 3, max: 64 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors.array()[0].msg, status: 400 };
    }

    const token = await userService.login(req.body);

    res.json({ token });
  }),
];

exports.checkAvailability = asyncHandler(async (req, res) => {
  const { email, username } = req.query;

  if (!email && !username) {
    throw { message: "Username or email required", status: 400 };
  }

  await userService.checkAvailability(email, username);

  res.json({ message: "OK" });
});

exports.confirmEmail = [
  body("code", "Link invalid")
    .isLength({ min: process.env.CONFIRMATION_CODE_LENGTH, max: process.env.CONFIRMATION_CODE_LENGTH })
    .isAlphanumeric(),
  body("username", "Link invalid").isLength({ min: 1, max: 32 }).isAlphanumeric(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors.array()[0].msg, status: 400 };
    }

    const { username, code } = req.body;

    await userService.confirmEmail(username, code);

    res.json({ message: "OK" });
  }),
];

exports.requestPasswordReset = [
  body("usernameOrEmail")
    .isLength({ min: 1, max: 64 })
    .withMessage("Login must be between 1-64 characters")
    .matches(/^[a-z0-9\.\+\@]+$/i)
    .withMessage("Login must be alphanumeric or @ . + characters"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors.array()[0].msg, status: 400 };
    }

    const { usernameOrEmail } = req.body;

    await userService.requestPasswordReset(usernameOrEmail);

    res.json({ message: "Email sent! Please open the link in the email to continue." });
  }),
];

exports.resetPassword = [
  body("password", "Password must be between 3-64 characters").isLength({ min: 3, max: 64 }),
  body("code", "Link invalid")
    .isLength({ min: process.env.CONFIRMATION_CODE_LENGTH, max: process.env.CONFIRMATION_CODE_LENGTH })
    .isAlphanumeric(),
  body("username", "Link invalid").isLength({ min: 1, max: 32 }).isAlphanumeric(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { message: errors.array()[0].msg, status: 400 };
    }

    const { password, username, code } = req.body;

    await userService.resetPassword(username, code, password);

    res.json({ message: "Password changed successfully" });
  }),
];
