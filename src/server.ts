import 'dotenv/config';
import UsersRoute from './routes/videos.route';
import validateEnv from './utils/validateEnv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import DB from './database';
import errorMiddleware from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';

validateEnv();

const app = express();

const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  app.use(morgan('combined', { stream }));
  app.use(cors({ origin: 'your.domain.com', credentials: true }));
} else if (env === 'development') {
  app.use(morgan('dev', { stream }));
  app.use(cors({ origin: true, credentials: true }));
}
DB.sequelize.sync({ force: false });
DB.Videos.sync({ force: false })
  .then(result => {
    logger.info(result);
  })
  .catch(err => {
    logger.error(err);
  });

app.use(hpp());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', new UsersRoute().router);

const options = {
  swaggerDefinition: {
    info: {
      title: 'REST API',
      version: '1.0.0',
      description: 'Example docs',
    },
  },
  apis: ['swagger.yaml'],
};

const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(`/`, (req, res) => res.send('404 Not Found'));

app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`🚀 App listening on the port ${port}`);
});
