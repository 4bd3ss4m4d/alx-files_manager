/*
Inside the folder utils, create a file redis.js that contains the class RedisClient.

RedisClient should have:

the constructor that creates a client to Redis:
any error of the redis client must be displayed in
the console (you should use on('error') of the redis client)
a function isAlive that returns true when the connection
to Redis is a success otherwise, false
an asynchronous function get that takes a string key as
argument and returns the Redis value stored for this key
an asynchronous function set that takes a string key,
a value and a duration in second as arguments to store it in Redis
(with an expiration set by the duration argument)
an asynchronous function del that takes a string key as argument
and remove the value in Redis for this key
After the class definition, create and export an instance of
RedisClient called redisClient.
*/

import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    // this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      // this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      console.log(this.client.connected);
      // this.client.connected = true;
    });
  }

  //  returns true when the connection to Redis is a success otherwise, false
  isAlive() {
    return this.client.connected;
  }

  //  takes a string key as argument and returns the Redis value stored for this key
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // that takes a string key, a value and a duration in second as arguments to store it in Redi
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /*
 takes a string key, a value and a duration in second
 as arguments to store it in Redis
 (with an expiration set by the duration argument)
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
