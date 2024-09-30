import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const QueueFileRedis = new Queue('fileQueue', 'redis://127.0.0.1:6379');

class FilesController {
  static async getUser(req) {
    const tkn = req.header('X-Token');
    const authKey = `auth_${tkn}`;
    const id = await redisClient.get(authKey);
    if (id) {
      const allUsers = dbClient.db.collection('users');
      const mongoID = new ObjectID(id);
      const userData = allUsers.findOne({ _id: mongoID });
      if (userData) return userData;
      return null;
    }
    return null;
  }

  static async postUpload(req, res) {
    const userData = await FilesController.getUser(req);
    if (!userData || userData === null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId, data,
    } = req.body;
    const { isPublic } = req.body.isPublic || false;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
    const userId = userData._id;
    const dataFiles = dbClient.db.collection('files');
    if (parentId) {
      const parObject = new ObjectID(parentId);
      const par = await dataFiles.findOne({ _id: parObject });
      if (!par) return res.status(400).json({ error: 'Parent not found' });
      if (par.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }
    if (type === 'folder') {
      dataFiles
        .insertOne({
          name,
          type,
          parentId: parentId || 0,
          isPublic,
          userId,
        })
        .then((result) => {
          res.status(201).json({
            id: result.insertedId,
            userId,
            name,
            type,
            isPublic: isPublic || false,
            parentId: parentId || 0,
          });
        })
        .catch((error) => console.log(error));
    } else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');

      try {
        try {
          await fs.mkdir(filePath, { recursive: true });
        } catch (error) {
          console.log(error);
        }
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        console.log(error);
      }

      dataFiles
        .insertOne({
          name,
          type,
          parentId: parentId || 0,
          isPublic,
          userId,
          localPath: fileName,
        })
        .then((result) => {
          res.status(201).json({
            id: result.insertedId,
            userId,
            name,
            type,
            isPublic: isPublic || false,
            parentId: parentId || 0,
          });

          if (type === 'image') QueueFileRedis.add({ userId, fileId: result.insertedId });
        })
        .catch((error) => console.log(error));
    }
    return null;
  }

  static async getIndex(request, response) {
    const userData = await FilesController.getUser(request);
    if (!userData) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const { parentId, page } = request.query;
    const pNum = page || 0;
    const databaseFiles = dbClient.db.collection('files');
    const userId = userData._id;
    let queryLine;
    if (!parentId) {
      queryLine = { userId };
    } else queryLine = { userId, parentId: ObjectID(parentId) };
    console.log(`query string === ${parentId}`);
    databaseFiles
      .aggregate([
        { $match: queryLine },
        { $sort: { _id: -1 } },
        {
          $facet: {
            metadata: [
              { $count: 'total' },
              { $addFields: { page: parseInt(pNum, 10) } },
            ],
            data: [{ $skip: 20 * parseInt(pNum, 10) }, { $limit: 20 }],
          },
        },
      ])
      .toArray((error, result) => {
        if (result) {
          const mod = result[0].data.map((file) => {
            const tmpFile = {
              ...file,
              id: file._id,
            };
            delete tmpFile._id;
            delete tmpFile.localPath;
            return tmpFile;
          });
          return response.status(200).json(mod);
        }
        console.log('Error occured');
        return response.status(404).json({ error: 'Not found' });
      });
    return null;
  }

  static async getShow(request, response) {
    const userData = await FilesController.getUser(request);
    if (!userData) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const userId = userData._id;
    const fileId = request.params.id;
    const allFiles = dbClient.db.collection('files');
    const mongoid = new ObjectID(fileId);
    const fileDataforUser = await allFiles.findOne({ _id: mongoid, userId });
    if (!fileDataforUser) return response.status(404).json({ error: 'Not found' });
    return response.status(200).json(fileDataforUser);
  }
  /**
   * @api {put} /files/:id/publish set isPublic to true on the file document based on the ID
   * @apiName putPublish
   * @apiGroup FilesController
   *
   * @apiParam {Number} id file document's unique ID.
   *
   * @apiSuccess {String} Update the value of isPublic to true.
   * @apiSuccess {json} file document with a status code 200.
   */

  static async putPublish(request, response) {
    const userData = await FilesController.getUser(request);
    if (!userData) return response.status(401).json({ error: 'Unauthorized' });
    const { id } = request.params;
    const allFiles = dbClient.db.collection('files');
    const mongoID = new ObjectID(id);
    const ValueAssigned = { $set: { isPublic: true } };
    const options = { returnOriginal: false };
    allFiles.findOneAndUpdate(
      { _id: mongoID, userId: userData._id },
      ValueAssigned,
      options,
      (error, file) => {
        if (!file.lastErrorObject.updatedExisting) {
          return response.status(404).json({ error: 'Not found' });
        }
        return response.status(200).json(file.value);
      },
    );
    return null;
  }
  /**
   * @api {put} /files/:id/unpublish set isPublic to true on the file document based on the ID
   * @apiName putUnpublish
   * @apiGroup FilesController
   *
   * @apiParam {Number} id file document's unique ID.
   *
   * @apiSuccess {String} Update the value of isPublic to false.
   * @apiSuccess {json} file document with a status code 200.
   */

  static async putUnpublish(request, response) {
    const user = await FilesController.getUser(request);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = request.params;
    const allFiles = dbClient.db.collection('files');
    const idObject = new ObjectID(id);
    const ValueAssigned = { $set: { isPublic: false } };
    const options = { returnOriginal: false };
    allFiles.findOneAndUpdate(
      { _id: idObject, userId: user._id },
      ValueAssigned,
      options,
      (err, file) => {
        if (!file.lastErrorObject.updatedExisting) {
          return response.status(404).json({ error: 'Not found' });
        }
        return response.status(200).json(file.value);
      },
    );
    return null;
  }
  /**
   * @api {get} /files/:id/data return the content of the file document based on the ID
   * @apiName getFile
   * @apiGroup FilesController
   *
   * @apiParam {Number} id file document's unique ID.
   *
   * @apiSuccess {String} Return the content of the file with the correct MIME-type.
   * @apiSuccess {Number} status code 200.
   */

  static async getFile(request, response) {
    const { id } = request.params;
    const fileSize = request.param('size');
    console.log(id);
    const files = dbClient.db.collection('files');
    const mongoID = new ObjectID(id);
    files.findOne({ _id: mongoID }, async (err, file) => {
      if (!file) return response.status(404).json({ error: 'Not found' });

      if (file.isPublic) {
        if (file.type === 'folder') {
          return response
            .status(400)
            .json({ error: "A folder doesn't have content" });
        }
        await FilesController.sendFile(file, fileSize, response);
      } else {
        const userData = await FilesController.getUser(request);
        if (!userData) {
          return response.status(404).json({ error: 'Not found' });
        }
        if (file.userId.toString() === userData._id.toString()) {
          if (file.type === 'folder') {
            return response
              .status(400)
              .json({ error: "A folder doesn't have content" });
          }
          await FilesController.sendFile(file, fileSize, response);
        } else return response.status(404).json({ error: 'Not found' });
      }
      return null;
    });
  }

  static async sendFile(file, size, response) {
    let fileName = file.localPath;
    if (size) fileName = `${file.localPath}_${size}`;

    try {
      const data = await fs.readFile(fileName);
      const contentType = mime.contentType(file.name);
      return response
        .header('Content-Type', contentType)
        .status(200)
        .send(data);
    } catch (error) {
      console.log(error);
      return response.status(404).json({ error: 'Not found' });
    }
  }
}

export default FilesController;
