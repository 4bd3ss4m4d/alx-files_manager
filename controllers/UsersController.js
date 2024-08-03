import sha1 from "sha1";
import dbClient from "../utils/db";
import redisClient from "../utils/redis";
import { ObjectID } from "mongodb";

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: "Missing email" });
      return;
    }
    if (!password) {
      res.status(400).json({ error: "Missing password" });
      return;
    }

    const allUsers = dbClient.db.collection("users");
    await allUsers.findOne({ email }, (err, result) => {
      if (result) {
        res.status(400).json({ error: "Already exist" });
      } else {
        const hashPwd = sha1(password);
        allUsers.insertOne({ email, password: hashPwd }).then((user) => {
          res.status(201).json({ id: user.insertedId, email });
        });
      }
    });
  }

  static async getMe(req, res) {
    const tkn = req.header("X-Token");
    const theKey = `auth_${tkn}`;
    const userId = await redisClient.get(theKey);
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const allUsers = dbClient.db.collection("users");
    const objectId = new ObjectID(userId);
    await allUsers.findOne({ _id: objectId }, (err, result) => {
      if (!result) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      res.status(200).json({ id: userId, email: result.email });
    });
  }
}

module.exports = UsersController;

