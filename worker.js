import { ObjectID } from 'mongodb';
import { promises as fs } from 'fs';
import imageThumbnail from 'image-thumbnail';
import Queue from 'bull';
import dbClient from './utils/db';

const REDIS_URL = 'redis://127.0.0.1:6379';

const QueueUserData = new Queue('userQueue', REDIS_URL);
const QueueFile = new Queue('fileQueue', REDIS_URL);

async function processThumbNails(width, localPath) {
  const thnail = await imageThumbnail(localPath, { width });
  return thnail;
}

async function genThumbnails(file, sizes) {
  const thnails = {};
  for (const size of sizes) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const thnail = await processThumbNails(size, file.localPath);
      const imgPath = `${file.localPath}_${size}`;
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(imgPath, thnail);
      thnails[size] = imgPath;
    } catch (error) {
      console.error(`Error generating thumbnail for size ${size}:`, error);
      throw new Error(`Failed to generate thumbnail for size ${size}`);
    }
  }
  return thnails;
}

QueueFile.process(async (job, done) => {
  console.log('WORKER STARTED...');
  const { fileId } = job.data;
  if (!fileId) done(new Error('Missing fileId'));

  const { userId } = job.data;
  if (!userId) done(new Error('Missing userId'));

  console.log(fileId, userId);
  const dataFiles = dbClient.db.collection('files');
  const idObject = new ObjectID(fileId);
  dataFiles.findOne({ _id: idObject }, async (err, file) => {
    if (!file) done(new Error('File not found'));
    else {
      const sizes = [500, 250, 100];
      await genThumbnails(file, sizes);
      done();
    }
  });
});

QueueUserData.process(async (job, done) => {
  const { userId } = job.data;
  if (!userId) done(new Error('Missing userId'));
  const allUsersData = dbClient.db.collection('users');
  const idObject = new ObjectID(userId);
  const user = await allUsersData.findOne({ _id: idObject });
  if (user) {
    console.log(`Welcome ${user.email}!`);
  } else {
    done(new Error('User not found'));
  }
});
