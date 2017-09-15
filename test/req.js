/**
 * Created by Sergey Ganziy 05.01.2017.
 */
const expressValidator = require('express-validator')({
    customValidators: {
        isArray(value) {
            return Array.isArray(value);
        }
    }
});

exports.stubForValidation = function (done) {
    var req;
    req = {
        query: {},
        body: {},
        params: {},
        headers: {},
        session: {},
        param(name) {
            return this.params[name];
        }
    };
    return expressValidator(req, {}, () => {
		done(req);
    });
};
