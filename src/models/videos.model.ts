import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Video } from '../interfaces/videos.interface';

export type VideoCreationAttributes = Optional<Video, 'title' | 'id' | 'description' | 'publishTime' | 'url' | 'channelTitle'>;

export class VideoModel extends Model<Video, VideoCreationAttributes> implements Video {
  public id: number;
  public title: string;
  public description: string;
  public publishTime: Date;
  public url: string;
  public channelTitle: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof VideoModel {
  VideoModel.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(500),
        unique: true,
      },

      description: {
        allowNull: false,
        type: DataTypes.STRING(500),
        unique: true,
      },
      publishTime: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      url: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      channelTitle: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
    },
    {
      tableName: 'Videos',
      sequelize,
    },
  );

  return VideoModel;
}
