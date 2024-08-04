import imageThumbnail from 'image-thumbnail';
import Queue from 'bull';
import { ObjectID } from 'mongodb';
import { promises as fs } from 'fs';
import dbClient from './utils/db';

const REDIS_URL = 'redis://127.0.0.1:6379';

const userQueue = new Queue('userQueue', REDIS_URL);
const fileQueue = new Queue('fileQueue', REDIS_URL);

async function processThumbNails(width, localPath) {
  const thumbnail = await imageThumbnail(localPath, { width });
  return thumbnail;
}

async function genThumbnails(file, sizes) {
  const thumbnails = {};
  for (const size of sizes) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const thumbnail = await processThumbNails(size, file.localPath);
      const imagePath = `${file.localPath}_${size}`;
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(imagePath, thumbnail);
      thumbnails[size] = imagePath;
    } catch (error) {
      console.error(`Error generating thumbnail for size ${size}:`, error);
      throw new Error(`Failed to generate thumbnail for size ${size}`);
    }
  }
  return thumbnails;
}

fileQueue.process(async (job, done) => {
  console.log('WORKER STARTED...');
  const { fileId } = job.data;
  if (!fileId) done(new Error('Missing fileId'));

  const { userId } = job.data;
  if (!userId) done(new Error('Missing userId'));

  console.log(fileId, userId);
  const files = dbClient.db.collection('files');
  const idObject = new ObjectID(fileId);
  files.findOne({ _id: idObject }, async (err, file) => {
    if (!file) done(new Error('File not found'));
    else {
      const sizes = [500, 250, 100];
      await genThumbnails(file, sizes);
      done();
    }
  });
});

userQueue.process(async (job, done) => {
  const { userId } = job.data;
  if (!userId) done(new Error('Missing userId'));
  const users = dbClient.db.collection('users');
  const idObject = new ObjectID(userId);
  const user = await users.findOne({ _id: idObject });
  if (user) {
    console.log(`Welcome ${user.email}!`);
  } else {
    done(new Error('User not found'));
  }
});
