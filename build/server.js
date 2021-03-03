"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const videos_route_1 = __importDefault(require("./routes/videos.route"));
const validateEnv_1 = __importDefault(require("./utils/validateEnv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const database_1 = __importDefault(require("./database"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const logger_1 = require("./utils/logger");
validateEnv_1.default();
const app = express_1.default();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
database_1.default.sequelize.sync({ force: false });
if (env === 'production') {
    app.use(morgan_1.default('combined', { stream: logger_1.stream }));
    app.use(cors_1.default({ origin: 'your.domain.com', credentials: true }));
}
else if (env === 'development') {
    app.use(morgan_1.default('dev', { stream: logger_1.stream }));
    app.use(cors_1.default({ origin: true, credentials: true }));
}
app.use(hpp_1.default());
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use('/', new videos_route_1.default().router);
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
const specs = swagger_jsdoc_1.default(options);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use(`/`, (req, res) => res.send('404 Not Found'));
app.use(error_middleware_1.default);
app.listen(port, () => {
    logger_1.logger.info(`🚀 App listening on the port ${port}`);
});
//# sourceMappingURL=server.js.map