import { Router } from 'express';
import { getVideosFromYoutube, getVideos } from '../controllers/videos.controller';

class VideoRoute {
  public path = '/users';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, (req, res) => res.send('Connection Established'));
    this.router.get(`${this.path}`, getVideosFromYoutube);
    this.router.get('/videos', getVideos);
  }
}

export default VideoRoute;
