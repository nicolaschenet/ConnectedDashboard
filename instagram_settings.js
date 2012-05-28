exports.redis               = require('redis');

exports.IG_APP_PORT         = process.env.IG_APP_PORT       || 3000;
exports.IG_CLIENT_ID        = process.env.IG_CLIENT_ID      || '#####';
exports.IG_CLIENT_SECRET    = process.env.IG_CLIENT_SECRET  || '#####';
exports.IG_API_HOST         = process.env.IG_API_HOST       || 'api.instagram.com';
exports.IG_API_PORT         = process.env.IG_API_PORT       || null;
exports.IG_BASE_PATH        = process.env.IG_BASE_PATH      || '';
exports.IG_HTTP_CLIENT      = (process.env.IG_USE_INSECURE ? require('http') : require('https'));
exports.REDIS_PORT          = 3001;
exports.REDIS_HOST          = '127.0.0.1';

