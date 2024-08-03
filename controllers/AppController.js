import redisClient from "../utils/redis";
import dbClient from "../utils/db";

class AppController {
  static getStatus(req, res) {
    const allStatus = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    console.log(allStatus);
    res.status(200).json(allStatus);
  }

  static async getStats(req, res) {
    const statistics = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    res.status(200).json(statistics);
  }
}

module.exports = AppController;

