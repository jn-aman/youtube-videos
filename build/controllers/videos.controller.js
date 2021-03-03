"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVideos = exports.getVideosFromYoutube = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
const database_1 = __importDefault(require("../database"));
const videoControllerHelper_1 = require("./helpers/videoControllerHelper");
const sequelize_1 = require("sequelize");
const getVideosFromYoutube = async (req, res) => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let time = yesterday;
        const latestRecordFromDB = await database_1.default.Videos.findOne({
            order: [['publishTime', 'DESC']],
        });
        if (latestRecordFromDB) {
            time = latestRecordFromDB.publishTime;
        }
        const response = await axios_1.default.get('https://youtube.googleapis.com/youtube/v3/search', {
            params: {
                key: process.env.YOUTUBE_API_KEY,
                part: 'snippet',
                order: 'date',
                q: 'music',
                type: 'video',
                maxResults: 20,
                publishedAfter: time.toISOString(),
            },
        });
        const dataToInsert = response.data.items.map(videoDetails => {
            const { title, channelTitle, publishTime, description } = videoDetails.snippet;
            const url = videoDetails.snippet.thumbnails.high.url;
            return {
                title,
                channelTitle,
                description: description.slice(0, 500),
                publishTime: new Date(publishTime),
                url,
            };
        });
        database_1.default.Videos.bulkCreate(dataToInsert, {
            updateOnDuplicate: ['title', 'description'],
        });
        await database_1.default.Videos.findAll();
        res.status(200).json({
            success: await database_1.default.Videos.findAll(),
        });
    }
    catch (error) {
        logger_1.logger.error(JSON.stringify(error));
        res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};
exports.getVideosFromYoutube = getVideosFromYoutube;
const getVideos = async (req, res) => {
    try {
        const { page, size, search } = req.query;
        const { limit, offset } = videoControllerHelper_1.getPagination(Number(page), Number(size));
        const condition = search
            ? {
                [sequelize_1.Op.or]: [
                    database_1.default.Sequelize.where(database_1.default.Sequelize.fn('lower', database_1.default.Sequelize.col('title')), 'LIKE', `%${search}%`),
                    database_1.default.Sequelize.where(database_1.default.Sequelize.fn('lower', database_1.default.Sequelize.col('description')), 'LIKE', `%${search}%`),
                ],
            }
            : null;
        const DBResponse = await database_1.default.Videos.findAndCountAll({ where: condition, order: [['publishTime', 'DESC']], limit, offset });
        const response = videoControllerHelper_1.getPagingData(DBResponse, page, limit);
        return res.status(200).json(Object.assign({ success: true }, response));
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message || 'Some error occurred while retrieving tutorials.',
        });
    }
};
exports.getVideos = getVideos;
//# sourceMappingURL=videos.controller.js.map