// config/database.js
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config/configuration');
const bookSvc = require('../app/models/book');

var Database = function () {
    'use strict';

    this.connected = false;
};
Database.prototype = {
    getDb(callback) {
        'use strict';

        const _this = this;
        if (this.connected) {
            if (typeof callback === 'function') {
                return callback(null, _this._db);
            }
        }
        MongoClient.connect(`mongodb://localhost:27017/${config.database}`, {
            autoReconnect: true
        }, (err, db) => {
            assert.equal(null, err);
            assert.ok(null !== db);
            if (err) {
                return callback(err);
            }
            db.on('error', (er) => {
                console.log('DB Err: ', er);
                _this.connected = false;
                callback(err);
            });
            db.on('close', () => {
                console.log('Connection closed');
                _this.connected = false;
                callback(new Error('Connection closed'));
            });
            bookSvc.connect(db);
            _this.connected = true;
            _this._db = db;
            console.log(`Connected to [${config.database}] database\n`);
            callback(err, db);
        });
    }
};

module.exports.Database = new Database();
