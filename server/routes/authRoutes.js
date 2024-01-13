const express = require("express");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const { validate, Joi } = require("express-validation");
const config = require("../config");

const router = express.Router();

const registerValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    reppassword: Joi.string().required(),
  }),
};

const signinValidationSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

router.post(
  "/register",
  validate(registerValidationSchema),
  async (req, res) => {
    const client = new MongoClient(config.DATABASE_URL);

    try {
      const { email, password, reppassword } = req.body;

      await client.connect();
      const database = client.db(config.DARABASE_NAME);

      const user = await database.collection("users").findOne({ email });

      if (user) {
        res.statusCode = 400;
        res.json({ message: "User with this email exists now" });
        return;
      }

      if (password !== reppassword) {
        res.statusCode = 400;
        res.json({ message: "Incorrect passwords" });
        return;
      }

      await database.collection("users").insertOne({
        email: email.toLowerCase(),
        password: await bcrypt.hash(password, 8),
        name: "",
        surname: "",
        gender: "",
        dateOfBirth: "",
        interests: [],
        genderInterest: [],
        about: "",
        matches: [],
        images: [],
      });

      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    } finally {
      await client.close();
    }
  }
);

router.post("/signin", validate(signinValidationSchema), async (req, res) => {
  console.log("sigin endpoint");
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { email, password } = req.body;

    await client.connect();
    const database = client.db(config.DARABASE_NAME);

    const user = await database.collection("users").findOne({ email });
    if (!user) {
      res.statusCode = 400;
      res.json({ message: "User with this email not exists" });
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.statusCode = 400;
      res.json({ message: "Bad password" });
      return;
    }

    const token = jwt.sign({ id: user._id, email }, config.SECRET_KEY, {
      expiresIn: config.TOKEN_EXPIRATION,
    });

    res.json({
      token,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.post("/checkauth", authMiddleware, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
