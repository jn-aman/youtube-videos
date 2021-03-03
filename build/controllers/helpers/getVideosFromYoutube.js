"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../../utils/logger");
const database_1 = __importDefault(require("../../database"));
const getVideosFromYoutube = async () => {
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
        await database_1.default.Videos.bulkCreate(dataToInsert, {
            updateOnDuplicate: ['title', 'description'],
        });
    }
    catch (error) {
        logger_1.logger.error(JSON.stringify(error));
    }
};
getVideosFromYoutube();
//# sourceMappingURL=getVideosFromYoutube.js.map