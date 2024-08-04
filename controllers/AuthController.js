import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const user64 = request.header('Authorization').split(' ')[1];
    const credentials = Buffer.from(user64, 'base64').toString('ascii');
    const [email, rawPassword] = credentials.split(':');
    if (!email || !rawPassword) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const password = sha1(rawPassword);

    const dbUsers = dbClient.db.collection('users');
    const user = await dbUsers.findOne({ email, password });
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    // set a  key for 24hrs
    await redisClient.set(key, user._id.toString(), 86400);
    response.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(key);
    res.status(204).send();
  }
}

module.exports = AuthController;
