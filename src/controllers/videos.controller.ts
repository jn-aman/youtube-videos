import { Request, Response } from 'express';
import { YoutubeResponse } from '../interfaces/videos.interface';

import axios from 'axios';
import { logger } from '../utils/logger';
import DB from '../database';
import { getPagination, getPagingData } from './helpers/videoControllerHelper';
import { Op } from 'sequelize';

const getVideosFromYoutube = async (req: Request, res: Response): Promise<void> => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let time = yesterday;
    const latestRecordFromDB = await DB.Videos.findOne({
      order: [['publishTime', 'DESC']],
    });
    if (latestRecordFromDB) {
      time = latestRecordFromDB.publishTime;
    }

    const response = await axios.get<YoutubeResponse>('https://youtube.googleapis.com/youtube/v3/search', {
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
    DB.Videos.bulkCreate(dataToInsert, {
      updateOnDuplicate: ['title', 'description'],
    });
    await DB.Videos.findAll();
    res.status(200).json({
      success: await DB.Videos.findAll(),
    });
  } catch (error) {
    logger.error(JSON.stringify(error));
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

const getVideos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { page, size, search } = req.query;
    const { limit, offset } = getPagination(Number(page), Number(size));
    const condition = search
      ? {
          [Op.or]: [
            DB.Sequelize.where(DB.Sequelize.fn('lower', DB.Sequelize.col('title')), 'LIKE', `%${search}%`),
            DB.Sequelize.where(DB.Sequelize.fn('lower', DB.Sequelize.col('description')), 'LIKE', `%${search}%`),
          ],
        }
      : null;
    const DBResponse = await DB.Videos.findAndCountAll({ where: condition, order: [['publishTime', 'DESC']], limit, offset });

    const response = getPagingData(DBResponse, page, limit);

    return res.status(200).json({
      success: true,
      ...response,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || 'Some error occurred while retrieving tutorials.',
    });
  }
};

export { getVideosFromYoutube, getVideos };
