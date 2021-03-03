"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModel = void 0;
const sequelize_1 = require("sequelize");
class VideoModel extends sequelize_1.Model {
}
exports.VideoModel = VideoModel;
function default_1(sequelize) {
    VideoModel.init({
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: sequelize_1.DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING(500),
            unique: true,
        },
        description: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING(500),
            unique: true,
        },
        publishTime: {
            allowNull: false,
            type: sequelize_1.DataTypes.DATE,
        },
        url: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING(1000),
        },
        channelTitle: {
            allowNull: false,
            type: sequelize_1.DataTypes.STRING(1000),
        },
    }, {
        tableName: 'Videos',
        sequelize,
    });
    return VideoModel;
}
exports.default = default_1;
//# sourceMappingURL=videos.model.js.map