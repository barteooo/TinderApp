const express = require("express");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");

const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");

const router = express.Router();

router.get("/one/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    await client.connect();
    const database = client.db(config.DARABASE_NAME);

    const user = await database
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      res.statusCode = 400;
      res.json({ message: "User with this id not exists" });
      return;
    }

    const userDTO = {
      _id: user._id,
      email: user.email,
    };

    res.json({ user: userDTO });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const {
      password,
      reppassword,
      name,
      surname,
      gender,
      dateOfBirth,
      interests,
      genderInterest,
      about,
      matches,
      images,
    } = req.body;

    const usersCollection = client.db(config.DARABASE_NAME).collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (password && reppassword && password === reppassword) {
      user.password = await bcrypt.hash(password, 8);
    }

    if (name) {
      user.name = name;
    }

    if (surname) {
      user.surname = surname;
    }

    if (gender) {
      user.gender = gender;
    }

    if (dateOfBirth) {
      user.dateOfBirth = dateOfBirth;
    }

    if (interests?.length > 0) {
      user.interests = interests;
    }

    if (genderInterest) {
      user.genderInterest = genderInterest;
    }

    if (about) {
      user.about = about;
    }

    if (matches?.length > 0) {
      user.matches = matches;
    }

    if (images?.length > 0) {
      user.matches = matches;
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...user } }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const { id } = req.params;
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
