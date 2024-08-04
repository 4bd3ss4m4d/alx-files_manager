import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const user64Header = request.header('Authorization').split(' ')[1];
    const creds = Buffer.from(user64Header, 'base64').toString('ascii');
    const [email, rawPassword] = creds.split(':');
    if (!email || !rawPassword) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const passwd = sha1(rawPassword);

    const allDBUsers = dbClient.db.collection('users');
    const userData = await allDBUsers.findOne({ email, password: passwd });
    if (!userData) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const tkn = uuidv4();
    const authKey = `auth_${tkn}`;
    await redisClient.set(authKey, userData._id.toString(), 86400);
    response.status(200).json({ token: tkn });
  }

  static async getDisconnect(req, res) {
    const tkn = req.header('X-Token');
    const authKey = `auth_${tkn}`;
    const userId = await redisClient.get(authKey);
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(authKey);
    res.status(204).send();
  }
}

module.exports = AuthController;
