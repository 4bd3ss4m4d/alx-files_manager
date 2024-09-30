import chai from 'chai';
import chaiHttp from 'chai-http';

import { v4 as uuidv4 } from 'uuid';

import { MongoClient, ObjectID } from 'mongodb';
import { promisify } from 'util';
import redis from 'redis';
import sha1 from 'sha1';
import fs from 'fs';

chai.use(chaiHttp);

//----------------- task0

//----------------- task1

//----------------- task2

describe('------------------\nTASK 2\nGET /status', () => {
    it('GET /status exists', (done) => {
        chai.request('http://localhost:5000')
            .get('/status')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            });
    }).timeout(30000);
});
describe('GET /status', () => {
    it('GET /status exists', (done) => {
        chai.request('http://localhost:5000')
            .get('/status')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                const bodyJson = res.body;
                chai.expect(bodyJson.redis).to.be.true;
                chai.expect(bodyJson.db).to.be.true;
                done();
            });
    }).timeout(30000);
});
describe('GET /stats', () => {
    it('GET /stats exists', (done) => {
        chai.request('http://localhost:5000')
            .get('/stats')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                done();
            });
    }).timeout(30000);
});
describe('GET /stats', () => {
    let testClientDb = null;

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /stats exists', (done) => {
        chai.request('http://localhost:5000')
            .get('/stats')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                const bodyJson = res.body;
                chai.expect(bodyJson.users).to.equal(0);
                chai.expect(bodyJson.files).to.equal(0);
                done();
            });
    }).timeout(30000);
});
describe('GET /stats', () => {
    let testClientDb = null;

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // add 2 users
                await testClientDb.collection('users').insertOne({ email: "me@me.com" })
                await testClientDb.collection('users').insertOne({ email: "me2@me.com" })

                // add 3 files
                await testClientDb.collection('files').insertOne({ name: "file 1" })
                await testClientDb.collection('files').insertOne({ name: "file 2" })
                await testClientDb.collection('files').insertOne({ name: "file 3" })

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /stats exists', (done) => {
        chai.request('http://localhost:5000')
            .get('/stats')
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                const bodyJson = res.body;
                chai.expect(bodyJson.users).to.equal(2);
                chai.expect(bodyJson.files).to.equal(3);
                done();
            });
    }).timeout(30000);
});
//----------------- task3

describe('------------------\nTASK 3\nGET /users', () => {
    let testClientDb = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /users creates a new user in DB (when pass correct parameters)', (done) => {
        const userParam = {
            email: `${fctRandomString()}@me.com`,
            password: `${fctRandomString()}`
        }
        chai.request('http://localhost:5000')
            .post('/users')
            .send(userParam)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);
                const resUserId = res.body.id
                const resUserEmail = res.body.email
                chai.expect(resUserEmail).to.equal(userParam.email);

                testClientDb.collection('users')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);
                        chai.expect(docs[0]._id.toString()).to.equal(resUserId);
                        chai.expect(docs[0].email).to.equal(resUserEmail);
                        done();
                    })
            });
    }).timeout(30000);
});
describe('GET /users', () => {
    let testClientDb = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /users with missing email', (done) => {
        const userParam = {
            password: `${fctRandomString()}`
        }
        chai.request('http://localhost:5000')
            .post('/users')
            .send(userParam)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
                const resError = res.body.error;
                chai.expect(resError).to.equal("Missing email");

                testClientDb.collection('users')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);
                        done();
                    })
            });
    }).timeout(30000);
});
describe('GET /users', () => {
    let testClientDb = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /users with missing password', (done) => {
        const userParam = {
            email: `${fctRandomString()}@me.com`
        }
        chai.request('http://localhost:5000')
            .post('/users')
            .send(userParam)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
                const resError = res.body.error;
                chai.expect(resError).to.equal("Missing password");

                testClientDb.collection('users')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);
                        done();
                    })
            });
    }).timeout(30000);
});
describe('GET /users', () => {
    let testClientDb = null;
    let initialUser = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                await testClientDb.collection('users').insertOne(initialUser);

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /users with email that already exists', (done) => {
        const userParam = {
            email: initialUser.email,
            password: `${fctRandomString()}`
        }
        chai.request('http://localhost:5000')
            .post('/users')
            .send(userParam)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);
                const resError = res.body.error;
                chai.expect(resError).to.equal("Already exist");

                testClientDb.collection('users')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);
                        const docUser = docs[0];
                        chai.expect(docUser.email).to.equal(initialUser.email);
                        chai.expect(docUser.password.toUpperCase()).to.equal(initialUser.password.toUpperCase());
                        done();
                    })
            });
    }).timeout(30000);
});
describe('GET /users', () => {
    let testClientDb = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                resolve();
            });
        });
    });

    afterEach(() => {
    });

    it('GET /users stores the password as SHA1', (done) => {
        const userParam = {
            email: `${fctRandomString()}@me.com` ,
            password: `${fctRandomString()}`
        }
        chai.request('http://localhost:5000')
            .post('/users')
            .send(userParam)
            .end((err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);
                const resUserId = res.body.id
                const resUserEmail = res.body.email
                chai.expect(resUserEmail).to.equal(userParam.email);

                testClientDb.collection('users')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);
                        const docUser = docs[0];
                        chai.expect(docUser._id.toString()).to.equal(resUserId);
                        chai.expect(docUser.email).to.equal(userParam.email);
                        chai.expect(docUser.password.toUpperCase()).to.equal(sha1(userParam.password).toUpperCase());
                        done();
                    })
            });
    }).timeout(30000);
});

//----------------- task4

describe('------------------\nTASK 4\nGET /connect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserPwd = null;
    let initialUserId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUserPwd = fctRandomString();
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(initialUserPwd)
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /connect with invalid Base64 content', (done) => {
        const basicAuth = `Basic ${Buffer.from(`hello`, 'binary').toString('base64')}`;
        chai.request('http://localhost:5000')
            .get('/connect')
            .set('Authorization', basicAuth)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                const authKeys = await redisKeysAsync('auth_*');
                chai.expect(authKeys.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});
describe('GET /connect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserPwd = null;
    let initialUserId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUserPwd = fctRandomString();
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(initialUserPwd)
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /connect with unknown user email', (done) => {
        const basicAuth = `Basic ${Buffer.from(`fake_${initialUser.email}:${initialUserPwd}`, 'binary').toString('base64')}`;
        chai.request('http://localhost:5000')
            .get('/connect')
            .set('Authorization', basicAuth)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                const authKeys = await redisKeysAsync('auth_*');
                chai.expect(authKeys.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});
describe('GET /connect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserPwd = null;
    let initialUserId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUserPwd = fctRandomString();
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(initialUserPwd)
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /connect  with wrong user password', (done) => {
        const basicAuth = `Basic ${Buffer.from(`${initialUser.email}:${initialUserPwd}_wrong`, 'binary').toString('base64')}`;
        chai.request('http://localhost:5000')
            .get('/connect')
            .set('Authorization', basicAuth)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                const authKeys = await redisKeysAsync('auth_*');
                chai.expect(authKeys.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});
describe('GET /connect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserPwd = null;
    let initialUserId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUserPwd = fctRandomString();
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(initialUserPwd)
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /connect with correct user email and password', (done) => {
        const basicAuth = `Basic ${Buffer.from(`${initialUser.email}:${initialUserPwd}`, 'binary').toString('base64')}`;
        chai.request('http://localhost:5000')
            .get('/connect')
            .set('Authorization', basicAuth)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                const resUserToken = res.body.token;
                chai.expect(resUserToken).to.not.be.null;

                const redisToken = await redisGetAsync(`auth_${resUserToken}`)
                chai.expect(redisToken).to.not.be.null;
                chai.expect(initialUserId).to.equal(redisToken);

                done();
            });
    }).timeout(30000);
});
describe('GET /disconnect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /disconnect with an incorrect token', (done) => {
        redisKeysAsync('auth_*')
        .then((keys) => {
            chai.expect(keys.length).to.equal(1);

            chai.request('http://localhost:5000')
                .get('/disconnect')
                .set('X-Token', "nope")
                .end(async (err, res) => {
                    chai.expect(err).to.be.null;
                    chai.expect(res).to.have.status(401);

                    const resError = res.body.error;
                    chai.expect(resError).to.equal("Unauthorized");

                    const authKeys = await redisKeysAsync('auth_*');
                    chai.expect(authKeys.length).to.equal(1);

                    done();
                });
        });
    }).timeout(30000);
});
describe('GET /disconnect', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /disconnect with an correct token', (done) => {
        redisKeysAsync('auth_*')
        .then((keys) => {
            chai.expect(keys.length).to.equal(1);

            chai.request('http://localhost:5000')
                .get('/disconnect')
                .set('X-Token', initialUserToken)
                .end(async (err, res) => {
                    chai.expect(err).to.be.null;
                    chai.expect(res).to.have.status(204);

                    const authKeys = await redisKeysAsync('auth_*');
                    chai.expect(authKeys.length).to.equal(0);

                    done();
                });
        });
    }).timeout(30000);
});
describe('GET /users/me', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /users/me with no token', (done) => {
        chai.request('http://localhost:5000')
            .get('/users/me')
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});
describe('GET /users/me', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /users/me with incorrect token', (done) => {
        chai.request('http://localhost:5000')
            .get('/users/me')
            .set('X-Token', "nope")
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});
describe('GET /users/me', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /users/me with an correct token', (done) => {
        chai.request('http://localhost:5000')
            .get('/users/me')
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resUser = res.body;
                chai.expect(resUser.email).to.equal(initialUser.email);
                chai.expect(resUser.id).to.equal(initialUserId);

                done();
            });
    }).timeout(30000);
});

//----------------- task5

describe('------------------\nTASK 5\nPOST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files invalid token user', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'folder'
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', `${initialUserToken}_121`)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);

                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files with missing name', (done) => {
        const fileData = {
            type: 'folder'
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Missing name");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);

                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files with missing type', (done) => {
        const fileData = {
            name: fctRandomString()
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Missing type");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);

                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files with missing data if type != folder', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'file'
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Missing data");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);

                        done();
                    })
            });
    }).timeout(30000);
});

describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files with invalid parentId', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'folder',
            parentId: initialUserId
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Parent not found");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(0);

                        done();
                    })
            });
    }).timeout(30000);
});

describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFakeFolder = {
                    userId: ObjectID(initialUserId),
                    name: "newFolder",
                    type: "file",
                    data: Buffer.from("hello", 'binary').toString('base64'),
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFakeFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files with a parentId not a folder', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'folder',
            parentId: initialFolderId
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Parent is not a folder");

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);

                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files creates a folder at the root', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'folder',
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(fileData.name);
                chai.expect(resFile.userId).to.equal(initialUserId);
                chai.expect(resFile.type).to.equal(fileData.type);
                chai.expect(resFile.parentId).to.equal(0);

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);
                        const docFile = docs[0];
                        chai.expect(docFile.name).to.equal(fileData.name);
                        chai.expect(docFile._id.toString()).to.equal(resFile.id);
                        chai.expect(docFile.userId.toString()).to.equal(initialUserId);
                        chai.expect(docFile.type).to.equal(fileData.type);
                        chai.expect(docFile.parentId.toString()).to.equal('0');
                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: "newFolder",
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('POST /files creates a folder inside a folder', (done) => {
        const fileData = {
            name: fctRandomString(),
            type: 'folder',
            parentId: initialFolderId
        }
        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(fileData.name);
                chai.expect(resFile.userId).to.equal(initialUserId);
                chai.expect(resFile.type).to.equal(fileData.type);
                chai.expect(resFile.parentId).to.equal(initialFolderId);

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(2);

                        const docFile = docs.filter((i) => i._id.toString() == resFile.id.toString())[0];
                        chai.expect(docFile.name).to.equal(fileData.name);
                        chai.expect(docFile._id.toString()).to.equal(resFile.id);
                        chai.expect(docFile.userId.toString()).to.equal(initialUserId);
                        chai.expect(docFile.type).to.equal(fileData.type);
                        chai.expect(docFile.parentId.toString()).to.equal(initialFolderId);
                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('POST /files creates a file at the root', (done) => {
        const fileClearContent = fctRandomString();
        const fileData = {
            name: fctRandomString(),
            type: 'file',
            data: Buffer.from(fileClearContent, 'binary').toString('base64')
        }

        let filesInTmpFilesManager = [];
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            filesInTmpFilesManager = fs.readdirSync(folderTmpFilesManagerPath);
        }

        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(fileData.name);
                chai.expect(resFile.userId).to.equal(initialUserId);
                chai.expect(resFile.type).to.equal(fileData.type);
                chai.expect(resFile.parentId).to.equal(0);

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(1);
                        const docFile = docs[0];
                        chai.expect(docFile.name).to.equal(fileData.name);
                        chai.expect(docFile._id.toString()).to.equal(resFile.id);
                        chai.expect(docFile.userId.toString()).to.equal(initialUserId);
                        chai.expect(docFile.type).to.equal(fileData.type);
                        chai.expect(docFile.parentId.toString()).to.equal('0');

                        let newFilesInTmpFilesManager = [];
                        if (fs.existsSync(folderTmpFilesManagerPath)) {
                            newFilesInTmpFilesManager = fs.readdirSync(folderTmpFilesManagerPath);
                        }
                        chai.expect(newFilesInTmpFilesManager.length).to.equal(filesInTmpFilesManager.length + 1);
                        const newFileInDiskPath = newFilesInTmpFilesManager.filter(x => !filesInTmpFilesManager.includes(x));

                        const newFileInDiskContent = fs.readFileSync(`${folderTmpFilesManagerPath}/${newFileInDiskPath[0]}`).toString();
                        chai.expect(newFileInDiskContent).to.equal(fileClearContent);

                        done();
                    })
            });
    }).timeout(30000);
});
describe('POST /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';


    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: "newFolder",
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('POST /files creates a file inside a folder', (done) => {
        const fileClearContent = fctRandomString();
        const fileData = {
            name: fctRandomString(),
            type: 'file',
            data: Buffer.from(fileClearContent, 'binary').toString('base64'),
            parentId: initialFolderId
        }

        let filesInTmpFilesManager = [];
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            filesInTmpFilesManager = fs.readdirSync(folderTmpFilesManagerPath);
        }

        chai.request('http://localhost:5000')
            .post('/files')
            .set('X-Token', initialUserToken)
            .send(fileData)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(201);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(fileData.name);
                chai.expect(resFile.userId).to.equal(initialUserId);
                chai.expect(resFile.type).to.equal(fileData.type);
                chai.expect(resFile.parentId).to.equal(initialFolderId);

                testClientDb.collection('files')
                    .find({})
                    .toArray((err, docs) => {
                        chai.expect(err).to.be.null;
                        chai.expect(docs.length).to.equal(2);

                        const docFile = docs.filter((i) => i._id.toString() == resFile.id.toString())[0];
                        chai.expect(docFile.name).to.equal(fileData.name);
                        chai.expect(docFile._id.toString()).to.equal(resFile.id);
                        chai.expect(docFile.userId.toString()).to.equal(initialUserId);
                        chai.expect(docFile.type).to.equal(fileData.type);
                        chai.expect(docFile.parentId.toString()).to.equal(initialFolderId);

                        let newFilesInTmpFilesManager = [];
                        if (fs.existsSync(folderTmpFilesManagerPath)) {
                            newFilesInTmpFilesManager = fs.readdirSync(folderTmpFilesManagerPath);
                        }
                        chai.expect(newFilesInTmpFilesManager.length).to.equal(filesInTmpFilesManager.length + 1);
                        const newFileInDiskPath = newFilesInTmpFilesManager.filter(x => !filesInTmpFilesManager.includes(x));

                        const newFileInDiskContent = fs.readFileSync(`${folderTmpFilesManagerPath}/${newFileInDiskPath[0]}`).toString();
                        chai.expect(newFileInDiskContent).to.equal(fileClearContent);

                        done();
                    })
            });
    }).timeout(30000);
});

//----------------- task6

describe('------------------\nTASK 6\nGET /files/:id', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files/:id invalid token user', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFolderId}`)
            .set('X-Token', `${initialUserToken}_121`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files/:id with no file linked to :id', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${new ObjectID()}`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: new ObjectID(),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files/:id with no file linked to :id for this user', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFolderId}`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolder = null;
    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files/:id with correct :id of the owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFolderId}`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(initialFolder.name);
                chai.expect(resFile.type).to.equal(initialFolder.type);
                chai.expect(resFile.parentId.toString()).to.equal(initialFolder.parentId.toString());
                chai.expect(resFile.userId.toString()).to.equal(initialFolder.userId.toString());

                done();
            });
    }).timeout(30000);
});

describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files invalid token user', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .set('X-Token', `${initialUserToken}_121`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});

describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFiles = [];

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add folders
                for(let i = 0 ; i < 25 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: '0'
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFiles.push(item)
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files with no parentId and no page', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resList = res.body;
                chai.expect(resList.length).to.equal(20);

                resList.forEach((item) => {
                    const itemIdx = initialFiles.findIndex((i) => i.id == item.id);
                    chai.assert.isAtLeast(itemIdx, 0);

                    const itemInit = initialFiles.splice(itemIdx, 1)[0];
                    chai.expect(itemInit).to.not.be.null;

                    chai.expect(itemInit.id).to.equal(item.id);
                    chai.expect(itemInit.name).to.equal(item.name);
                    chai.expect(itemInit.type).to.equal(item.type);
                    chai.expect(itemInit.parentId).to.equal(item.parentId);
                });

                chai.expect(initialFiles.length).to.equal(5);

                done();
            });
    }).timeout(30000);
});

describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFiles = [];

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add folders
                for(let i = 0 ; i < 25 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: '0'
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFiles.push(item)
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files with a wrong parentId and no page', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .set('X-Token', initialUserToken)
            .query({ parentId: new ObjectID().toString() })
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resList = res.body;
                chai.expect(resList.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});


describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFiles = [];

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add folders
                const initialFolders = []
                for(let i = 0 ; i < 25 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: '0'
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFolders.push(item)
                }

                // Add 2 folders inside a folder
                for(let i = 0 ; i < 2 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: ObjectID(initialFolders[0].id)
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFiles.push(item)
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files with a valid parentId and no page', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .query({ parentId: initialFiles[0].parentId.toString() })
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resList = res.body;
                chai.expect(resList.length).to.equal(2);

                resList.forEach((item) => {
                    const itemIdx = initialFiles.findIndex((i) => i.id == item.id);
                    chai.assert.isAtLeast(itemIdx, 0);

                    const itemInit = initialFiles.splice(itemIdx, 1)[0];
                    chai.expect(itemInit).to.not.be.null;

                    chai.expect(itemInit.id).to.equal(item.id);
                    chai.expect(itemInit.name).to.equal(item.name);
                    chai.expect(itemInit.type).to.equal(item.type);
                    chai.expect(itemInit.parentId.toString()).to.equal(item.parentId.toString());
                });

                chai.expect(initialFiles.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});

describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFiles = [];

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add folders
                for(let i = 0 ; i < 25 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: '0'
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFiles.push(item)
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files with no parentId and second page', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .query({ page: 1 })
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resList = res.body;
                chai.expect(resList.length).to.equal(5);

                resList.forEach((item) => {
                    const itemIdx = initialFiles.findIndex((i) => i.id == item.id);
                    chai.assert.isAtLeast(itemIdx, 0);

                    const itemInit = initialFiles.splice(itemIdx, 1)[0];
                    chai.expect(itemInit).to.not.be.null;

                    chai.expect(itemInit.id).to.equal(item.id);
                    chai.expect(itemInit.name).to.equal(item.name);
                    chai.expect(itemInit.type).to.equal(item.type);
                    chai.expect(itemInit.parentId).to.equal(item.parentId);
                });

                chai.expect(initialFiles.length).to.equal(20);

                done();
            });
    }).timeout(30000);
});

describe('GET /files', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFiles = [];

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add folders
                for(let i = 0 ; i < 25 ; i += 1) {
                    const item = {
                        userId: ObjectID(initialUserId),
                        name: fctRandomString(),
                        type: "folder",
                        parentId: '0'
                    };
                    const createdFileDocs = await testClientDb.collection('files').insertOne(item);
                    if (createdFileDocs && createdFileDocs.ops.length > 0) {
                        item.id = createdFileDocs.ops[0]._id.toString();
                    }
                    initialFiles.push(item)
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('GET /files with no parentId and a page too far', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files`)
            .query({ page: 10 })
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resList = res.body;
                chai.expect(resList.length).to.equal(0);

                done();
            });
    }).timeout(30000);
});
//----------------- task7

describe('------------------\nTASK 7\nPUT /files/:id/publish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/publish invalid token user', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/publish`)
            .set('X-Token', `${initialUserToken}_121`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});

describe('PUT /files/:id/publish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/publish with no file linked to :id', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${new ObjectID()}/publish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('PUT /files/:id/publish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: new ObjectID(),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/publish with no file linked to :id for this user', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/publish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('PUT /files/:id/publish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolder = null;
    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: false
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/publish with correct :id of the owner - file not published yet', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/publish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(initialFolder.name);
                chai.expect(resFile.type).to.equal(initialFolder.type);
                chai.expect(resFile.isPublic).to.true
                chai.expect(resFile.parentId.toString()).to.equal(initialFolder.parentId.toString());
                chai.expect(resFile.userId.toString()).to.equal(initialFolder.userId.toString());

                done();
            });
    }).timeout(30000);
});


describe('PUT /files/:id/publish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolder = null;
    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: true
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/publish with correct :id of the owner - file already published yet', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/publish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(initialFolder.name);
                chai.expect(resFile.type).to.equal(initialFolder.type);
                chai.expect(resFile.isPublic).to.true
                chai.expect(resFile.parentId.toString()).to.equal(initialFolder.parentId.toString());
                chai.expect(resFile.userId.toString()).to.equal(initialFolder.userId.toString());

                done();
            });
    }).timeout(30000);
});

describe('PUT /files/:id/unpublish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/unpublish invalid token user', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/unpublish`)
            .set('X-Token', `${initialUserToken}_121`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(401);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Unauthorized");

                done();
            });
    }).timeout(30000);
});
describe('PUT /files/:id/unpublish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/unpublish with no file linked to :id', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${new ObjectID()}/unpublish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});
describe('PUT /files/:id/unpublish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                const initialFolder = {
                    userId: new ObjectID(),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0'
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/unpublish with no file linked to :id for this user', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/unpublish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});
describe('PUT /files/:id/unpublish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolder = null;
    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: false
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/unpublish with correct :id of the owner - file not published yet', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/unpublish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(initialFolder.name);
                chai.expect(resFile.type).to.equal(initialFolder.type);
                chai.expect(resFile.isPublic).to.false
                chai.expect(resFile.parentId.toString()).to.equal(initialFolder.parentId.toString());
                chai.expect(resFile.userId.toString()).to.equal(initialFolder.userId.toString());

                done();
            });
    }).timeout(30000);
});
describe('PUT /files/:id/unpublish', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFolder = null;
    let initialFolderId = null;

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder
                initialFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: true
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFolder);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFolderId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
    });

    it('PUT /files/:id/unpublish with correct :id of the owner - file already published yet', (done) => {
        chai.request('http://localhost:5000')
            .put(`/files/${initialFolderId}/unpublish`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);

                const resFile = res.body;
                chai.expect(resFile.name).to.equal(initialFolder.name);
                chai.expect(resFile.type).to.equal(initialFolder.type);
                chai.expect(resFile.isPublic).to.false
                chai.expect(resFile.parentId.toString()).to.equal(initialFolder.parentId.toString());
                chai.expect(resFile.userId.toString()).to.equal(initialFolder.userId.toString());

                done();
            });
    }).timeout(30000);
});


//----------------- task8

describe('------------------\nTASK 8\nGET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, `Hello-${uuidv4()}`);

                const initialFile = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with no file linked to :id', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${new ObjectID()}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});
describe('GET /files/:id/data', () => {
    let testClientDb;

    let fileUser = null;
    let fileUserId = null;

    let initialUser = null;
    let initialUserId = null;

    let initialFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 user owner of file
                fileUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdUserFileDocs = await testClientDb.collection('users').insertOne(fileUser);
                if (createdUserFileDocs && createdUserFileDocs.ops.length > 0) {
                    fileUserId = createdUserFileDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, `Hello-${uuidv4()}`);

                const initialFile = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                resolve();
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file linked to :id but user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});
describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let fileUser = null;
    let fileUserId = null;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 user owner of file
                fileUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdUserFileDocs = await testClientDb.collection('users').insertOne(fileUser);
                if (createdUserFileDocs && createdUserFileDocs.ops.length > 0) {
                    fileUserId = createdUserFileDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, `Hello-${uuidv4()}`);

                const initialFile = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file linked to :id but user authenticated and not owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFileId = null;
    let initialFileContent = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                initialFileContent = `Hello-${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, initialFileContent);

                const initialFile = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .set('X-Token', initialUserToken)
            .buffer()
            .parse((res, cb) => {
                res.setEncoding("binary");
                res.data = "";
                res.on("data", (chunk) => {
                    res.data += chunk;
                });
                res.on("end", () => {
                    cb(null, new Buffer(res.data, "binary"));
                });
            })
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.toString()).to.equal(initialFileContent);

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;

    let initialUser = null;
    let initialUserId = null;

    let initialFileId = null;
    let initialFileContent = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                initialFileContent = `Hello-${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, initialFileContent);

                const initialFile = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                resolve();
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with a published file linked to :id and user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .buffer()
            .parse((res, cb) => {
                res.setEncoding("binary");
                res.data = "";
                res.on("data", (chunk) => {
                    res.data += chunk;
                });
                res.on("end", () => {
                    cb(null, new Buffer(res.data, "binary"));
                });
            })
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.toString()).to.equal(initialFileContent);

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let fileUser = null;
    let fileUserId = null;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFileId = null;
    let initialFileContent = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 user owner of file
                fileUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdUserFileDocs = await testClientDb.collection('users').insertOne(fileUser);
                if (createdUserFileDocs && createdUserFileDocs.ops.length > 0) {
                    fileUserId = createdUserFileDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                initialFileContent = `Hello-${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, initialFileContent);

                const initialFile = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with a published file linked to :id and user authenticated but not owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .set('X-Token', initialUserToken)
            .buffer()
            .parse((res, cb) => {
                res.setEncoding("binary");
                res.data = "";
                res.on("data", (chunk) => {
                    res.data += chunk;
                });
                res.on("end", () => {
                    cb(null, new Buffer(res.data, "binary"));
                });
            })
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.toString()).to.equal(initialFileContent);

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialFileId = null;
    let initialFileContent = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file
                fctCreateTmp();
                const fileLocalPath = `${folderTmpFilesManagerPath}/${uuidv4()}`;
                initialFileContent = `Hello-${uuidv4()}`;
                fs.writeFileSync(fileLocalPath, initialFileContent);

                const initialFile = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: fileLocalPath
                };
                const createdFileDocs = await testClientDb.collection('files').insertOne(initialFile);
                if (createdFileDocs && createdFileDocs.ops.length > 0) {
                    initialFileId = createdFileDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with a published file linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialFileId}/data`)
            .set('X-Token', initialUserToken)
            .buffer()
            .parse((res, cb) => {
                res.setEncoding("binary");
                res.data = "";
                res.on("data", (chunk) => {
                    res.data += chunk;
                });
                res.on("end", () => {
                    cb(null, new Buffer(res.data, "binary"));
                });
            })
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(200);
                chai.expect(res.body.toString()).to.equal(initialFileContent);

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;

    let initialUser = null;
    let initialUserId = null;

    let initialUnpublishedFolderId = null;
    let initialPublishedFolderId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder unpublished
                const initialUnpublishedFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: false
                };
                const createdUFolderDocs = await testClientDb.collection('files').insertOne(initialUnpublishedFolder);
                if (createdUFolderDocs && createdUFolderDocs.ops.length > 0) {
                    initialUnpublishedFolderId = createdUFolderDocs.ops[0]._id.toString();
                }

                // Add 1 folder published
                const initialPublishedFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: true
                };
                const createdPFolderDocs = await testClientDb.collection('files').insertOne(initialPublishedFolder);
                if (createdPFolderDocs && createdPFolderDocs.ops.length > 0) {
                    initialPublishedFolderId = createdPFolderDocs.ops[0]._id.toString();
                }

                resolve();
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished folder linked to :id but user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFolderId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with a published folder linked to :id but user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFolderId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("A folder doesn't have content");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let fileUser = null;
    let fileUserId = null;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialUnpublishedFolderId = null;
    let initialPublishedFolderId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 user owner of file
                fileUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdUserFileDocs = await testClientDb.collection('users').insertOne(fileUser);
                if (createdUserFileDocs && createdUserFileDocs.ops.length > 0) {
                    fileUserId = createdUserFileDocs.ops[0]._id.toString();
                }

                // Add 1 folder unpublished
                const initialUnpublishedFolder = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: false
                };
                const createdUFolderDocs = await testClientDb.collection('files').insertOne(initialUnpublishedFolder);
                if (createdUFolderDocs && createdUFolderDocs.ops.length > 0) {
                    initialUnpublishedFolderId = createdUFolderDocs.ops[0]._id.toString();
                }

                // Add 1 folder published
                const initialPublishedFolder = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: true
                };
                const createdPFolderDocs = await testClientDb.collection('files').insertOne(initialPublishedFolder);
                if (createdPFolderDocs && createdPFolderDocs.ops.length > 0) {
                    initialPublishedFolderId = createdPFolderDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished folder linked to :id but user authenticated and not owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFolderId}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with a published folder linked to :id but user authenticated and not owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFolderId}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("A folder doesn't have content");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialUnpublishedFolderId = null;
    let initialPublishedFolderId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 folder unpublished
                const initialUnpublishedFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: false
                };
                const createdUFolderDocs = await testClientDb.collection('files').insertOne(initialUnpublishedFolder);
                if (createdUFolderDocs && createdUFolderDocs.ops.length > 0) {
                    initialUnpublishedFolderId = createdUFolderDocs.ops[0]._id.toString();
                }

                // Add 1 folder published
                const initialPublishedFolder = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "folder",
                    parentId: '0',
                    isPublic: true
                };
                const createdPFolderDocs = await testClientDb.collection('files').insertOne(initialPublishedFolder);
                if (createdPFolderDocs && createdPFolderDocs.ops.length > 0) {
                    initialPublishedFolderId = createdPFolderDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveAllRedisKeys();
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished folder linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFolderId}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("A folder doesn't have content");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with a published folder linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFolderId}/data`)
            .set('X-Token', initialUserToken)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(400);

                const resError = res.body.error;
                chai.expect(resError).to.equal("A folder doesn't have content");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;

    let initialUser = null;
    let initialUserId = null;

    let initialUnpublishedFileId = null;
    let initialPublishedFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file publish
                fctCreateTmp();
                const initialFileP = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFilePDocs = await testClientDb.collection('files').insertOne(initialFileP);
                if (createdFilePDocs && createdFilePDocs.ops.length > 0) {
                    initialPublishedFileId = createdFilePDocs.ops[0]._id.toString();
                }

                // Add 1 file unpublish
                const initialFileUP = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFileUPDocs = await testClientDb.collection('files').insertOne(initialFileUP);
                if (createdFileUPDocs && createdFileUPDocs.ops.length > 0) {
                    initialUnpublishedFileId = createdFileUPDocs.ops[0]._id.toString();
                }

                resolve();
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file not present locally linked to :id and user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with a published file not present locally linked to :id and user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let fileUser = null;
    let fileUserId = null;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialUnpublishedFileId = null;
    let initialPublishedFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 user owner of file
                fileUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdUserFileDocs = await testClientDb.collection('users').insertOne(fileUser);
                if (createdUserFileDocs && createdUserFileDocs.ops.length > 0) {
                    fileUserId = createdUserFileDocs.ops[0]._id.toString();
                }

                // Add 1 file publish
                fctCreateTmp();
                const initialFileP = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFilePDocs = await testClientDb.collection('files').insertOne(initialFileP);
                if (createdFilePDocs && createdFilePDocs.ops.length > 0) {
                    initialPublishedFileId = createdFilePDocs.ops[0]._id.toString();
                }

                // Add 1 file unpublish
                const initialFileUP = {
                    userId: ObjectID(fileUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFileUPDocs = await testClientDb.collection('files').insertOne(initialFileUP);
                if (createdFileUPDocs && createdFileUPDocs.ops.length > 0) {
                    initialUnpublishedFileId = createdFileUPDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file not present locally linked to :id and user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with a published file not present locally linked to :id and user unauthenticated', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

describe('GET /files/:id/data', () => {
    let testClientDb;
    let testRedisClient;
    let redisDelAsync;
    let redisGetAsync;
    let redisSetAsync;
    let redisKeysAsync;

    let initialUser = null;
    let initialUserId = null;
    let initialUserToken = null;

    let initialUnpublishedFileId = null;
    let initialPublishedFileId = null;

    const folderTmpFilesManagerPath = process.env.FOLDER_PATH || '/tmp/files_manager';

    const fctRandomString = () => {
        return Math.random().toString(36).substring(2, 15);
    }
    const fctRemoveAllRedisKeys = async () => {
        const keys = await redisKeysAsync('auth_*');
        keys.forEach(async (key) => {
            await redisDelAsync(key);
        });
    }
    const fctCreateTmp = () => {
        if (!fs.existsSync(folderTmpFilesManagerPath)) {
            fs.mkdirSync(folderTmpFilesManagerPath);
        }
    }
    const fctRemoveTmp = () => {
        if (fs.existsSync(folderTmpFilesManagerPath)) {
            fs.readdirSync(`${folderTmpFilesManagerPath}/`).forEach((i) => {
                fs.unlinkSync(`${folderTmpFilesManagerPath}/${i}`)
            })
        }
    }

    beforeEach(() => {
        const dbInfo = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '27017',
            database: process.env.DB_DATABASE || 'files_manager'
        };
        return new Promise((resolve) => {
            fctRemoveTmp();
            MongoClient.connect(`mongodb://${dbInfo.host}:${dbInfo.port}/${dbInfo.database}`, async (err, client) => {
                testClientDb = client.db(dbInfo.database);

                await testClientDb.collection('users').deleteMany({})
                await testClientDb.collection('files').deleteMany({})

                // Add 1 user
                initialUser = {
                    email: `${fctRandomString()}@me.com`,
                    password: sha1(fctRandomString())
                }
                const createdDocs = await testClientDb.collection('users').insertOne(initialUser);
                if (createdDocs && createdDocs.ops.length > 0) {
                    initialUserId = createdDocs.ops[0]._id.toString();
                }

                // Add 1 file publish
                fctCreateTmp();
                const initialFileP = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: true,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFilePDocs = await testClientDb.collection('files').insertOne(initialFileP);
                if (createdFilePDocs && createdFilePDocs.ops.length > 0) {
                    initialPublishedFileId = createdFilePDocs.ops[0]._id.toString();
                }

                // Add 1 file unpublish
                const initialFileUP = {
                    userId: ObjectID(initialUserId),
                    name: fctRandomString(),
                    type: "file",
                    parentId: '0',
                    isPublic: false,
                    localPath: `${folderTmpFilesManagerPath}/${uuidv4()}`
                };
                const createdFileUPDocs = await testClientDb.collection('files').insertOne(initialFileUP);
                if (createdFileUPDocs && createdFileUPDocs.ops.length > 0) {
                    initialUnpublishedFileId = createdFileUPDocs.ops[0]._id.toString();
                }

                testRedisClient = redis.createClient();
                redisDelAsync = promisify(testRedisClient.del).bind(testRedisClient);
                redisGetAsync = promisify(testRedisClient.get).bind(testRedisClient);
                redisSetAsync = promisify(testRedisClient.set).bind(testRedisClient);
                redisKeysAsync = promisify(testRedisClient.keys).bind(testRedisClient);
                testRedisClient.on('connect', async () => {
                    fctRemoveAllRedisKeys();

                    // Set token for this user
                    initialUserToken = uuidv4()
                    await redisSetAsync(`auth_${initialUserToken}`, initialUserId)
                    resolve();
                });
            });
        });
    });

    afterEach(() => {
        fctRemoveTmp();
    });

    it('GET /files/:id/data with an unpublished file not present locally linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialUnpublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);

    it('GET /files/:id/data with an published file not present locally linked to :id and user authenticated and owner', (done) => {
        chai.request('http://localhost:5000')
            .get(`/files/${initialPublishedFileId}/data`)
            .end(async (err, res) => {
                chai.expect(err).to.be.null;
                chai.expect(res).to.have.status(404);

                const resError = res.body.error;
                chai.expect(resError).to.equal("Not found");

                done();
            });
    }).timeout(30000);
});

console.log("----")









