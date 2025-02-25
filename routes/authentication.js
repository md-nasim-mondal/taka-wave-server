import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userCollection } from "../db/takaWaveDB.js";

const router = express.Router();

// register a user
router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const rawPIN = user.pin;

    // check for existing user
    const userExists = await userCollection.findOne({
      $or: [{ email: user.email }, { mobile: user.mobile }],
    });

    if (userExists) {
      return res.send({ message: "User Already Exists!" });
    }

    // generate hashed PIN
    const hashedPIN = await bcrypt.hash(rawPIN, 13);
    user.pin = hashedPIN;

    const result = await userCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    console.error("Error Registering User: ", error);
    res.status(500).send({ message: "Registration Error!" });
  }
});

// login a user
router.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const { credential, pin } = req.body;

    const user = await userCollection.findOne({
      $or: [{ email: credential }, { mobile: credential }],
    });

    if (!user) {
      return res.send({ success: false, message: "Account Not Found!" });
    }

    const pinMatched = await bcrypt.compare(pin, user.pin);

    if (!pinMatched) {
      return res.send({ success: false, message: "Wrong PIN!" });
    }

    delete user.pin;

    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.send({ token, success: true, message: "Successfully Logged In!" });
  } catch (error) {
    res.status(500).send({ message: "Login Error!" });
  }
});

export default router;
