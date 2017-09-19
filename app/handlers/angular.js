/**
 * Created by Sergey Ganziy on 19.09.2017.
 */
const csvParser = require('csv-parse');
const fs = require('fs');
const moment = require('moment');
const path = require('path');
const bookSvc = require('../models/book');

module.exports = {
    // home page route
    index(req, res, next) {
        res.render('angular/index', {
            title: 'Address Book'
        });
    },
    async get(req, res) {
        const start = parseInt(req.query.iDisplayStart);
        const limit = parseInt(req.query.iDisplayLength);
        const sortCol = req.query.iSortCol_0;
        const sortDirection = req.query.sSortDir_0;
        const search = req.query.sSearch;
        const cursor = bookSvc.getAddress(search);
        try {
            const total = await cursor.count();
            let sort = {};
            if (0 == sortCol) {
                sort = 'firstname';
            } else if (1 == sortCol) {
                sort = 'lastname';
            } else if (2 == sortCol) {
                sort = 'email';
            }
            cursor.sort([[sort, sortDirection]]);
            cursor.skip(start).limit(limit);
            const result = await cursor.toArray();
            result.forEach((item) => {
                item.created_at = moment.utc(item.created_at).calendar();
            });
            console.log(result);
            res.json({
                data: result,
                recordsFiltered: total,
                recordsTotal: total
            });
        } catch (err) {
            console.error(err, err.stack);
            res.json({
                message: err.message
            });
        }
    },
    post(req, res, next) {
        if (!req.file) {
            return res.redirect('/angular');
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
                res.redirect('/angular');
            });
        });
        input.pipe(parser);
    }
};
