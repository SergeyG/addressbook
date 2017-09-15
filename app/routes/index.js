/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'public/files/' });
const apiHandlers = require('../handlers/api');
const publicHandlers = require('../handlers/public');

module.exports = function (app) {
    'use strict';

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    // route middleware to make sure
    router.get('/', publicHandlers.index)
        .get('/page/:page', publicHandlers.index)
        .post('/post-file', upload.single('csvFileInput'), publicHandlers.post)
        .put('/api/update-address/:addressId', apiHandlers.updateAddress)
        .delete('/api/delete-address/:addressId', apiHandlers.deleteAddress);
    app.use('/', router);
};
