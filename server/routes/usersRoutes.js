const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");

const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "./../temp/",
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const upload = multer({ storage });

router.get("/one/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    await client.connect();
    const database = client.db(config.DATABASE_NAME);

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
      name: user.name,
      surname: user.surname,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      interests: user.interests,
      genderInterest: user.genderInterest,
      about: user.about,
      matches: user.matches,
      images: user.images,
    };

    res.json({ user: userDTO });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/current", authMiddleware, async (req, res) => {
  const userDTO = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    surname: req.user.surname,
    gender: req.user.gender,
    dateOfBirth: req.user.dateOfBirth,
    interests: req.user.interests,
    genderInterest: req.user.genderInterest,
    about: req.user.about,
    matches: req.user.matches,
    images: req.user.images,
    filterByInterests: req.user.filterByInterests,
  };

  res.json({ user: userDTO });
});

router.get("/interest", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    let users = [];
    if (req.user.filterByInterests) {
      users = await usersCollection
        .find({
          _id: { $ne: req.user._id },
          gender: req.user.genderInterest,
          interests: {
            $in: req.user.interests,
          },
          gotMatches: {
            $nin: [req.user._id],
          },
          $or: [
            {
              gotNotMatches: {
                $not: {
                  $elemMatch: {
                    id: req.user._id,
                  },
                },
              },
            },
            {
              gotNotMatches: {
                $elemMatch: {
                  date: {
                    $lt: new Date(Date.now() - 10000),
                  },
                  _id: req.user.id,
                },
              },
            },
          ],
        })
        .toArray();
    } else {
      users = await usersCollection
        .find({
          _id: { $ne: req.user._id },
          gender: req.user.genderInterest,
          gotMatches: {
            $nin: [req.user._id],
          },
          $or: [
            {
              gotNotMatches: {
                $not: {
                  $elemMatch: {
                    id: req.user._id,
                  },
                },
              },
            },
            {
              gotNotMatches: {
                $elemMatch: {
                  date: {
                    $lt: new Date(Date.now() - 10000),
                  },
                  _id: req.user.id,
                },
              },
            },
          ],
        })
        .toArray();
    }

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/matches", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    const users = await usersCollection
      .find({
        _id: { $in: req.user.matches },
      })
      .toArray();

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.get("/profilefile/:id", async (req, res) => {
  const { id } = req.params;

  const client = new MongoClient(config.DATABASE_URL);

  return new Promise((resolve, reject) => {
    client
      .connect()
      .then((c) => {
        const usersCollection = client
          .db(config.DATABASE_NAME)
          .collection("users");

        usersCollection.findOne({ _id: new ObjectId(id) }).then((user) => {
          const userData = {
            name: user.name,
            surname: user.surname,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            interests: user.interests,
            genderInterest: user.genderInterest,
            about: user.about,
            images: user.images,
            filterByInterests: user.filterByInterests,
          };

          const filename = `userdata_${Date.now()}.json`;
          const filePath = `./../temp/${filename}`;
          fs.writeFile(filePath, JSON.stringify(userData), (fileData) => {
            res.download(filePath);
            resolve();
          });
        });
      })
      .catch(() => {
        reject();
      });
  });
});

router.post(
  "/profilefile",
  authMiddleware,
  upload.single("file"),
  (req, res) => {
    const client = new MongoClient(config.DATABASE_URL);

    return new Promise((resolve, reject) => {
      console.log(req.file.path);

      fs.readFile(req.file.path, "utf-8", (err, data) => {
        if (err) {
          console.error(err);
          reject();
          return;
        }

        const userData = JSON.parse(data);
        resolve(userData);
      });
    }).then((userData) => {
      const usersCollection = client
        .db(config.DATABASE_NAME)
        .collection("users");

      usersCollection
        .updateOne(
          {
            _id: req.user._id,
          },
          {
            $set: {
              ...userData,
            },
          }
        )
        .then(() => {
          res.sendStatus(200);
        });
    });
  }
);

router.put("/addmatch/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      res.sendStatus(400);
    }

    let isMatch = false;
    if (
      req.user.gotMatches.some((x) => x.toString() == user._id.toString()) &&
      !req.user.matches.some((x) => x.toString() == user._id.toString())
    ) {
      await usersCollection.updateOne(
        { _id: req.user._id },
        {
          $set: { matches: [...req.user.matches, user._id] },
        }
      );

      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { matches: [...user.matches, req.user._id] },
        }
      );

      await messagesCollection.insertOne({
        usersIds: [req.user._id, user._id],
        messages: [],
      });

      isMatch = true;
    }

    if (!user.gotMatches.some((x) => x.toString() == req.user._id.toString())) {
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { gotMatches: [...user.gotMatches, req.user._id] },
        }
      );
    }

    res.status(200).json({
      isMatch,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.put("/addnotmatch/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
    const { id } = req.params;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      res.sendStatus(400);
    }

    const index = user.gotNotMatches.findIndex((x) => x.id === req.user._Id);
    if (index >= 0) {
      user.gotNotMatches[index].date = new Date();
      await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            gotNotMatches: [...user.gotNotMatches],
          },
        }
      );
    } else {
      await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            gotNotMatches: [
              ...user.gotMatches,
              { id: req.user._id, date: new Date() },
            ],
          },
        }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.put("/current", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);

  try {
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
      filterByInterests,
      gotMatches,
      gotNotMatches,
    } = req.body;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");

    const user = req.user;
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

    if (matches) {
      user.matches = matches;
    }

    if (images) {
      user.images = images;
    }

    if (filterByInterests != null && filterByInterests != undefined) {
      user.filterByInterests = filterByInterests;
    }

    if (gotMatches) {
      user.gotMatches = gotMatches;
    }

    if (gotNotMatches) {
      user.gotNotMatches = gotNotMatches;
    }

    await usersCollection.updateOne({ _id: user._id }, { $set: { ...user } });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/current", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const result = await client
      .db(config.DATABASE_NAME)
      .collection("users")
      .deleteOne({ _id: req.user._id });
    console.log(result);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

router.delete("/match/:id", authMiddleware, async (req, res) => {
  const client = new MongoClient(config.DATABASE_URL);
  try {
    const { id } = req.params;
    const { user } = req;

    const usersCollection = client.db(config.DATABASE_NAME).collection("users");
    const messagesCollection = client
      .db(config.DATABASE_NAME)
      .collection("messages");

    const matchedUser = await usersCollection.findOne({
      _id: new ObjectId(id),
    });

    matchedUser.matches = matchedUser.matches.filter(
      (x) => x.toString() !== req.user._id.toString()
    );

    matchedUser.gotMatches = matchedUser.gotMatches.filter(
      (x) => x.toString() !== req.user._id.toString()
    );

    await usersCollection.updateOne(
      { _id: matchedUser._id },
      {
        $set: {
          matches: [...matchedUser.matches],
          gotMatches: [...matchedUser.gotMatches],
        },
      }
    );

    user.matches = user.matches.filter(
      (x) => x.toString() !== matchedUser._id.toString()
    );

    user.gotMatches = user.gotMatches.filter(
      (x) => x.toString() !== matchedUser._id.toString()
    );

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          matches: [...user.matches],
          gotMatches: [...user.gotMatches],
        },
      }
    );

    await messagesCollection.deleteOne({
      $and: [
        { usersIds: { $in: [req.user._id] } },
        { usersIds: { $in: [user._id] } },
      ],
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } finally {
    await client.close();
  }
});

module.exports = router;
