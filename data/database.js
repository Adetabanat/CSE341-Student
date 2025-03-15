const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error("MONGO_URI is not defined. Check your .env file.");
}

let _db;

const initDb = async () => {
    if (_db) {
        console.log("Database is already initialized!");
        return _db;
    }

    try {
        const client = await MongoClient.connect(uri);
        _db = client.db();
        console.log("Database Connected!");
    } catch (err) {
        console.error("Database connection failed", err);
        throw err;
    }
};

const getDb = () => {
    if (!_db) {
        throw new Error("Database not initialized!");
    }
    return _db;
};

module.exports = { initDb, getDb };
