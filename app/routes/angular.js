/**
 * Created by Sergey Ganziy on 19.09.2017.
 */
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'public/files/' });
const angularHandlers = require('../handlers/angular');

module.exports = function (app) {
    'use strict';

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    // route middleware to make sure
    router.get('/', angularHandlers.index)
        .get('/api/datatable.json', angularHandlers.get)
        .post('/post-file', upload.single('file'), angularHandlers.post);
    app.use('/angular', router);
};
