/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
const csvParser = require('csv-parse');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const bookSvc = require('../models/book');

function tryParseInt(value, def) {
    var val;
    try {
        val = parseInt(value, 10);
        if (isNaN(val)) {
            val = def;
        }
        return val;
    } catch (ex) {
        return def;
    }
}

module.exports = {
    // home page route
    async index(req, res, next) {
        const limit = 12;
        const page = tryParseInt(req.params.page, 1);
        const start = (page * limit) - limit;
        const cursor = bookSvc.getAddress();
        try {
            const total = await cursor.count();
            cursor.skip(start).limit(limit);
            const result = await cursor.toArray();
            result.forEach((item) => {
                item.created_at = moment.utc(item.created_at).calendar();
            });
            const addressPagination = [];
            const totalPages = (total / limit) + 1;
            let i = 1;
            for (; i < totalPages; i++) {
                addressPagination.push({
                    page: i
                });
            }
            res.render('html/index', {
                title: 'Address Book',
                addressList: result,
                currentpage: page,
                addressPagination
            });
        } catch (err) {
            console.error(err, err.stack);
            res.render('html/error', {
                title: 'Error occured',
                message: err.message
            });
        }
    },
    post(req, res, next) {
        if (!req.file) {
            return res.redirect('/html');
        }
        const filePath = path.join(process.cwd(), req.file.path);
        const parser = csvParser({
            delimiter: ',',
            columns: true,
            skip_empty_lines: true,
            skip_lines_with_empty_values: true
        });
        const input = fs.createReadStream(filePath);
        let record;
        const batch = bookSvc.bulkStart();
        // Use the writable stream api
        parser.on('readable', function () {
            while (record = parser.read()) {
                batch.insert(record);
            }
        });
        // Catch any error
        parser.on('error', function (err) {
            console.error(err.message);
        });
        // When we are done, test that the parsed output matched what expected
        parser.on('finish', function () {
            batch.execute(function(err, result) {
                if (err) {
                    console.error(err, err.stack);
                    return res.render('html/error', {
                        title: 'Error occured',
                        message: err.message
                    });
                }
                console.log('finish', result.nInserted);
                res.redirect('/html');
            });
        });
        input.pipe(parser);
    }
};
