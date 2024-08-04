// import mongodb from 'mongodb';
const { MongoClient } = require('mongodb');
// import { MongoClient } from 'mongodb/lib/mongo_client';
// import Collection from 'mongodb/lib/collection';
// import envLoader from './env_loader';
const host = process.env.DB_HOST || 'localhost';
const port = +(process.env.DB_PORT) || 27017;
const dbName = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/${dbName}`;

class DBClient {
  constructor() {
    // envLoader();
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      // console.log(`db ${this.client.isConnected()}`);
      console.log(this.client.isConnected());
      this.db = this.client.db(dbName);
    }).catch((err) => {
      console.log(err);
    });
  }

  // returns true when the connection to MongoDB is a success otherwise, false
  isAlive() {
    return this.client.isConnected();
  }

  // returns the number of documents in the collection users
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  // returns the number of documents in the collection files
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  // Retrieves a reference to the `users` collection.
  async usersCollection() {
    return this.client.db().collection('users');
  }

  //  Retrieves a reference to the `files` collection.
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

// create and export an instance of DBClient called dbClient
module.exports = new DBClient();
