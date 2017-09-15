const compression = require('compression');
const debug = require('debug')('AddressBook:server');
const dustjs = require('adaro');
const express = require('express');
const favicon = require('serve-favicon');
const http = require('http');
const helpers = require('common-dustjs-helpers');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const methodOverride = require('method-override');

const frontend = require('./app/routes/index');
const templCompilers = require('./app/custom/templ_compilers');

const db = require('./config/database').Database;
const config = require('./config/configuration');

const app = express();

app.use(compression({
    threshold: 512 // 512 byte minimum before compressing output
}));

// view engine setup
const engine = dustjs.dust({
    whitespace: false,
    cache: false,
    helpers: ['dustjs-helpers'],
    debugLevel: 'DEBUG'
});

engine.dust.optimizers.format = (ctx, node) => node;
helpers.export_to(engine.dust);
app.engine('dust', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
app.set('template_engine', engine);
app.set('view engine', 'dust');
app.set('view options', { layout: false });
app.locals.pretty = true;

app.use(favicon(path.join(__dirname, 'public/images/favicon.png')));
if ('development' === app.get('env')) {
    app.use(logger('dev'));
} else {
    app.use(logger('combined', {
        skip(req, res) {
            return res.statusCode < 400;
        }
    }));
}
app.use(cookieParser());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
    customValidators: {
        isArray(value) {
            return Array.isArray(value);
        }
    }
}));

app.use(methodOverride());  /** for PUT & DELETE supporting */

const compilers = templCompilers(); /** load, compile and cache partial templates for ajax query */
compilers.compileAll();

// insert this before your routes
app.use((req, res, next) => {
    'use strict';

    var key;
    for (key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});
app.use((req, res, next) => {
    'use strict';

    req.dust = engine.dust;
    req.compilers = compilers;
    db.getDb((err, value) => {
        if (err) {
            return next(err);
        }
        req.db = value;
        return next();
    });
});

// Make our db accessible to our router
/** ignore unauthorized certificate errors */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Enable CORS from client-side
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

frontend(app); /** load our routes and pass in our app and fully configured passport */

// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.render('404', {
        title: 'Page Not found',
        host: req.headers.host,
        user: req.user,
        contentClass: 'no-content'
    });
});

// error handlers
function logErrors(err, req, res, next) {
    'use strict';

    debug(err.stack);
    next(err);
}
function clientErrorHandler(err, req, res, next) {
    'use strict';

    console.error(err);
    if (req.xhr) {
        res.status(500).send({ error: 'Something blew up!' });
    } else {
        next(err);
    }
}
function errorRender(err, req, res, next) {
    'use strict';

    console.error(err);
    res.status(500).send({ error: 'Something blew up!' });
}

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.set('json spaces', 4);
    /**
     * development error handler will print stacktrace
     */
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorRender);
} else if ('production' === app.get('env')) {
    console.log = function () {};
    // production error handler
    // no stacktraces leaked to user
    app.use(errorRender);
}
const port = config.port || 4545;
app.set('port', port);

process.on('unhandledRejection', (reason) => {
    throw reason;
});

process.on('uncaughtException', (err) => {
    console.error(err, err.stack);
    process.exit(1);
});

module.exports = app;

const server = http.createServer(app);
server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    console.log(`Server listening on ${bind}`);
    console.log('Application ready to serve requests.');
}

server.on('error', onError);
server.on('listening', onListening);
