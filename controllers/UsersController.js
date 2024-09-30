import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }

    const allUsers = dbClient.db.collection('users');
    await allUsers.findOne({ email }, (err, result) => {
      if (result) {
        response.status(400).json({ error: 'Already exist' });
      } else {
        const hashPwd = sha1(password);
        allUsers.insertOne({ email, password: hashPwd }).then((user) => {
          response.status(201).json({ id: user.insertedId, email });
        });
      }
    });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const users = dbClient.db.collection('users');
    const objectId = new ObjectID(userId);
    await users.findOne({ _id: objectId }, (error, result) => {
      if (!result) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
      }
      response.status(200).json({ id: userId, email: result.email });
    });
  }
}

module.exports = UsersController;
