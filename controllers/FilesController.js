import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import mime from 'mime-types';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');

class FilesController {
  static async getUser(req) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    if (id) {
      const users = dbClient.db.collection('users');
      const mongoID = new ObjectID(id);
      const user = users.findOne({ _id: mongoID });
      if (user) return user;
      return null;
    }
    return null;
  }

  static async postUpload(req, res) {
    const user = await FilesController.getUser(req);
    // console.log(`user id  = ${userId}`);
    if (!user || user === null) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId, data,
    } = req.body;
    const { isPublic } = req.body.isPublic || false;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });
    // console.log(user);
    const userId = user._id;
    const files = dbClient.db.collection('files');
    if (parentId) {
      const parentObject = new ObjectID(parentId);
      const parent = await files.findOne({ _id: parentObject });
      if (!parent) return res.status(400).json({ error: 'Parent not found' });
      if (parent.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
    }
    if (type === 'folder') {
      files.insertOne({
        name, type, parentId: parentId || 0, isPublic, userId,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId,
          name,
          type,
          isPublic: isPublic || false,
          parentId: parentId || 0,
        });
      }).catch((error) => console.log(error));
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

      files.insertOne({
        name, type, parentId: parentId || 0, isPublic, userId, localPath: fileName,
      }).then((result) => {
        res.status(201).json({
          id: result.insertedId,
          userId,
          name,
          type,
          isPublic: isPublic || false,
          parentId: parentId || 0,
        });

        if (type === 'image') fileQueue.add({ userId, fileId: result.insertedId });
      }).catch((error) => console.log(error));
    }
    return null;
  }

  static async getIndex(request, response) {
    const user = await FilesController.getUser(request);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const {
      parentId, page,
    } = request.query;
    const pageNum = page || 0;
    const dbfiles = dbClient.db.collection('files');
    const userId = user._id;
    let query;
    if (!parentId) {
      query = { userId };
    } else query = { userId, parentId: ObjectID(parentId) };
    console.log(`query string === ${parentId}`);
    dbfiles.aggregate([
      { $match: query },
      { $sort: { _id: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }, { $addFields: { page: parseInt(pageNum, 10) } }],
          data: [{ $skip: 20 * parseInt(pageNum, 10) }, { $limit: 20 }],
        },
      },
    ]).toArray((err, result) => {
      if (result) {
        const mod = result[0].data.map((file) => {
          const tmpFile = {
            ...file,
            id: file._id,
          };
          // remove _id/ set to undef
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
    const user = await FilesController.getUser(request);
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    const userId = user._id;
    const fileId = request.params.id;
    const files = dbClient.db.collection('files');
    const mongoid = new ObjectID(fileId);
    const file = await files.findOne({ _id: mongoid, userId });
    if (!file) return response.status(404).json({ error: 'Not found' });
    return response.status(200).json(file);
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
    const user = await FilesController.getUser(request);
    if (!user) return response.status(401).json({ error: 'Unauthorized' });
    const { id } = request.params;
    const files = dbClient.db.collection('files');
    const mongoID = new ObjectID(id);
    const newValue = { $set: { isPublic: true } };
    const options = { returnOriginal: false };
    files.findOneAndUpdate({ _id: mongoID, userId: user._id }, newValue, options, (err, file) => {
      if (!file.lastErrorObject.updatedExisting) {
        return response.status(404).json({ error: 'Not found' });
      }
      return response.status(200).json(file.value);
    });
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
    const files = dbClient.db.collection('files');
    const idObject = new ObjectID(id);
    const newValue = { $set: { isPublic: false } };
    const options = { returnOriginal: false };
    files.findOneAndUpdate({ _id: idObject, userId: user._id }, newValue, options, (err, file) => {
      if (!file.lastErrorObject.updatedExisting) {
        return response.status(404).json({ error: 'Not found' });
      }
      return response.status(200).json(file.value);
    });
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
    const size = request.param('size');
    console.log(id);
    const files = dbClient.db.collection('files');
    const mongoID = new ObjectID(id);
    files.findOne({ _id: mongoID }, async (err, file) => {
      if (!file) return response.status(404).json({ error: 'Not found' });

      // console.log(file.localPath);
      if (file.isPublic) {
        if (file.type === 'folder') return response.status(400).json({ error: "A folder doesn't have content" });
        await FilesController.sendFile(file, size, response);
      } else {
        const user = await FilesController.getUser(request);
        if (!user) {
          return response.status(404).json({ error: 'Not found' });
        }
        if (file.userId.toString() === user._id.toString()) {
          if (file.type === 'folder') {
            return response.status(400).json({ error: "A folder doesn't have content" });
          }
          await FilesController.sendFile(file, size, response);
        } else return response.status(404).json({ error: 'Not found' });
      }
      return null;
    });
    // return null;
  }

  static async sendFile(file, size, response) {
    let fileName = file.localPath;
    if (size) fileName = `${file.localPath}_${size}`;

    try {
      const data = await fs.readFile(fileName);
      const contentType = mime.contentType(file.name);
      return response.header('Content-Type', contentType).status(200).send(data);
    } catch (error) {
      console.log(error);
      return response.status(404).json({ error: 'Not found' });
    }
  }
}

export default FilesController;
