
require('dotenv').config();
exports.CLIENT_ORIGIN= process.env.CLIENT_ORIGIN || 'http://localhost:3000';
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost/jwt-auth-demo';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'foo',
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';


