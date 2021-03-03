import { YoutubeResponse } from '../../interfaces/videos.interface';

import axios from 'axios';
import { logger } from '../../utils/logger';
import DB from '../../database';

const getVideosFromYoutube = async (): Promise<void> => {
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
    await DB.Videos.bulkCreate(dataToInsert, {
      updateOnDuplicate: ['title', 'description'],
    });
  } catch (error) {
    logger.error(JSON.stringify(error));
  }
};

getVideosFromYoutube();
