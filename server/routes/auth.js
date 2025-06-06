import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from '../models/User.js';
import {
  mailExistance,
  loginValidation,
  tokenCheck,
  usernameExistance
} from '../middlewares/authMiddleware.js';
import { generateRandomID } from '../utils/utils.js';

const router = express.Router();

router.use(cors({
  credentials: true,
  origin: true
}));

router.use(cookieParser());

router.post("/register", [mailExistance, usernameExistance], async (req, res) => {
  // if (req.headers.origin != process.env.SERVER_CLIENT_URL) return res.sendStatus(401);
  if (req.emailExist) {
    return res.status(409).json({
      code: 409,
      type: "mail",
      message: "Email already exist in our Database"
    });
  }
  if (req.usernameExist) {
    return res.status(409).json({
      code: 409,
      type: "username",
      message: "Username already exist in our Database"
    });
  }
  try {
    let user = new User(req.body);
    const saveUser = async () => {
      let randomId = generateRandomID(9);
      let userExist = await User.exists({ id: randomId });

      if (userExist) return await saveUser();

      user.id = randomId;
      await user.save();

      res.status(201).json({
        code: 201,
        message: "New User have been created"
      });
    };

    await saveUser();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: 500,
      message: "Unknown error happened"
    });
  }
});

router.post("/login", loginValidation, (req, res) => {
  if (req.headers.origin != process.env.SERVER_CLIENT_URL) return res.sendStatus(401);
  if (req.invalidPassword == false) {
    const payload = { id: req.userId, email: req.body.mail };
    const token = jwt.sign(payload, process.env.SERVER_JWT, {
      expiresIn: '1h',
    });
    res.status(200).json({
      code: 200,
      token,
      message: "Login Successful",
      user: {
        id: req.userId,
        username: req.username,
        profileName: req.profileName,
        mail: req.body.mail,
        picture: req.picture
      }
    });
  } else if (req.accountExist == false || req.invalidPassword == true) {
    res.status(404).json({
      code: 404,
      type: "user",
      message: "User not found"
    });
  }
});

router.post("/password/check", async (req, res) => {
  if (req.headers.origin != process.env.SERVER_CLIENT_URL) return res.sendStatus(401);
  let userId = req.body.id;
  let password = req.body.password;
  let exist = await User.exists({ id: userId });
  if (!exist) return res.status(404).json({
    success: false,
    code: 404,
    valid: false
  });
  User.findOne({ id: userId }, async function (err, post) {
    let comparedPassword = await post.comparePassword(password);
    res.status(200).json({
      code: 200,
      valid: comparedPassword
    });
  });
});

router.get("/check", tokenCheck, (req, res) => {
  if (req.headers.origin != process.env.SERVER_CLIENT_URL) return res.sendStatus(401);
  res.status(200).json({ code: 200, message: 'Working' });
});

router.get("/decode", (req, res) => {
  if (req.headers.origin != process.env.SERVER_CLIENT_URL) return res.sendStatus(401);
  let cookie = req.cookies["token"] || req.headers['x-access-token'];
  if (!cookie) return res.status(404).json({
    id: null,
    mail: null
  });
  jwt.verify(cookie, process.env.SERVER_JWT, function (err, decoded) {
    if (err || !decoded) {
      res.status(401).json({
        code: 401,
        type: "token_expired",
        message: "JWT expired"
      });
    } else {
      res.status(200).json({
        code: 200,
        id: decoded.id,
        mail: decoded.email
      });
    }
  });
});

export default router;
