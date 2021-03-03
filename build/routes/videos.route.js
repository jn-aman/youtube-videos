"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videos_controller_1 = require("../controllers/videos.controller");
class VideoRoute {
    constructor() {
        this.path = '/users';
        this.router = express_1.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`/`, (req, res) => res.send('Connection Established'));
        this.router.get(`${this.path}`, videos_controller_1.getVideosFromYoutube);
        this.router.get('/videos', videos_controller_1.getVideos);
    }
}
exports.default = VideoRoute;
//# sourceMappingURL=videos.route.js.map