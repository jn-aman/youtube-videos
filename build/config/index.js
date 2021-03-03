"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    development: {
        username: 'root',
        password: 'jainxx',
        database: 'sequelize',
        host: 'mysql',
        dialect: 'mysql',
    },
    test: {
        username: 'root',
        password: 'jainxx',
        database: 'sequelize',
        host: 'mysql',
        dialect: 'mysql',
    },
    production: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
    },
};
exports.default = dbConfig;
//# sourceMappingURL=index.js.map