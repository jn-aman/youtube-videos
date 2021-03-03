"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = __importDefault(require("../config"));
const logger_1 = require("../utils/logger");
const videos_model_1 = __importDefault(require("../models/videos.model"));
const env = process.env.NODE_ENV || 'development';
const sequelize = new sequelize_1.default.Sequelize(config_1.default[env].database, config_1.default[env].username, config_1.default[env].password, {
    host: config_1.default[env].host,
    dialect: config_1.default[env].dialect,
    timezone: '+09:00',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    pool: config_1.default[env].pool,
    logQueryParameters: true,
    logging: (query, time) => {
        logger_1.logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});
sequelize
    .authenticate()
    .then(() => {
    logger_1.logger.info('🟢 The database is connected.');
})
    .catch((error) => {
    logger_1.logger.error(`🔴 Unable to connect to the database: ${error}.`);
});
const DB = {
    Videos: videos_model_1.default(sequelize),
    sequelize,
    Sequelize: // connection instance (RAW queries)
    sequelize_1.default, // library
};
exports.default = DB;
//# sourceMappingURL=index.js.map