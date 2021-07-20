const User = require("../models/user.model");
const PasswordReset = require("../models/passwordReset.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getRandomCode = async () => {
  const { randomBytes } = require("crypto");
  return new Promise((resolve, reject) => {
    randomBytes(parseInt(process.env.CONFIRMATION_CODE_LENGTH / 2), (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString("hex"));
    });
  });
};

const jwtSign = (payload, secret) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
};

const sendEmail = async (to, subject, text) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOSTNAME,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true" ? true : false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
  });
};

const getByUsernameOrEmail = async (usernameOrEmail) => {
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    emailValidated: true,
  });

  if (!user) {
    throw { message: "User does not exists or email not validated", status: 400 };
  }

  return user;
};

exports.checkAvailability = async (email, username) => {
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) return;

  if (user.email === email) throw { message: "Email already in use", status: 400 };
  if (user.username === username) throw { message: "Username already in use", status: 400 };
};

exports.signup = async (user) => {
  const emailConfirmationCode = await getRandomCode();

  const newUser = new User({
    username: user.username,
    passwordHash: await bcrypt.hash(user.password, 10),
    email: user.email,
    emailConfirmationCode,
  });

  try {
    await newUser.save();
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      if (/index: email.*? dup key/.test(err.message)) {
        throw { message: "Email already in use", status: 400 };
      } else {
        throw { message: "Username already in use", status: 400 };
      }
    }

    throw err;
  }

  const emailConfirmationLink = `${process.env.WEBSITE_BASE_URL}/confirm?code=${emailConfirmationCode}&user=${newUser.username}`;

  const to = `${newUser.username} <${newUser.email}>`;
  const subject = "Email confirmation";
  const text = `Hello ${newUser.username},\n\nopen the link to confirm your email:\n${emailConfirmationLink}`;

  if (process.env.NODE_ENV !== "test") {
    console.log(emailConfirmationLink);
  }
  // await sendEmail(to, subject, text);
};

exports.login = async (data) => {
  const { usernameOrEmail, password } = data;

  const user = await getByUsernameOrEmail(usernameOrEmail);

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    throw { message: "Password wrong", status: 400 };
  }

  const token = await jwtSign({ userid: user.id }, process.env.JWT_SECRET);

  return token;
};

exports.confirmEmail = async (username, emailConfirmationCode) => {
  const user = await User.findOne({ username, emailConfirmationCode });
  if (!user) {
    throw { message: "Link invalid", status: 400 };
  }

  const ageInMilliSeconds = Date.now() - new Date(user.emailConfirmationCreatedAt).getTime();
  if (ageInMilliSeconds > 300_000) throw { message: "Link expired", status: 400 };

  user.emailValidated = true;
  await user.save();
};

exports.requestPasswordReset = async (usernameOrEmail) => {
  const user = await getByUsernameOrEmail(usernameOrEmail);

  const code = await getRandomCode();

  await PasswordReset.deleteOne({ userId: user._id });
  const newPasswordReset = await PasswordReset.create({
    userId: user._id,
    code,
  });

  const link = `${process.env.WEBSITE_BASE_URL}/password?code=${code}&user=${user.username}`;
  const to = `${user.username} <${user.email}>`;
  const subject = "Password reset";
  const text = `Hello ${user.username},\n\nopen the link to reset your password:\n${link}`;

  await sendEmail(to, subject, text);
};

exports.resetPassword = async (username, code, password) => {
  const user = await User.findOne({ username, emailValidated: true });

  if (!user) {
    throw { message: "User does not exists or email not validated", status: 400 };
  }

  const passwordReset = await PasswordReset.findOne({ userId: user._id });
  if (!passwordReset || passwordReset.code !== code) {
    throw { message: "Link invalid", status: 400 };
  }

  const ageInMilliSeconds = Date.now() - new Date(passwordReset._id.getTimestamp()).getTime();
  if (ageInMilliSeconds > 300_000) throw { message: "Link expired", status: 400 };

  user.passwordHash = bcrypt.hashSync(password);
  await user.save();

  await passwordReset.deleteOne();
};
