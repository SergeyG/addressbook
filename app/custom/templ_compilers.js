/**
 * Created by Sergey Ganziy on 13.09.2017.
 */
const fs = require('fs');
const debug = require('debug')('AddressBook:server');
const dust = require('dustjs-linkedin');
const cache = {};
require('dustjs-helpers');
require('common-dustjs-helpers').exportTo(dust);

module.exports = function () {
    'use strict';

    function compileTemplate(templName, templatePath, callback) {
        function onTemplload(err, data) {
            var compiled;
            if (err) {
                debug(err);
                callback(err, null);
            } else {
                cache[templName] = templatePath;
                compiled = dust.compile(data.toString(), templName);
                dust.loadSource(compiled);
                if (typeof callback === 'function') {
                    callback(null, dust);
                }
            }
        }
        if (undefined === dust.cache[templName]) {
            fs.readFile(templatePath, 'utf-8', onTemplload);
        } else {
            callback(null, dust);
        }
    }
    return {
        compile: compileTemplate,
        render(templateName, callback) {
            if (undefined === dust.cache[templateName]) {
                compileTemplate(templateName, cache[templateName], callback);
            } else {
                callback(null, dust);
            }
        },
        compileAll() {
            compileTemplate('address_partial', 'views/html/partial/address.dust');
        }

    };
};
