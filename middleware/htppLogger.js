const morgan = require('morgan');
import { logger } from '../utils';

logger.stream = {
    write: message => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

export const httpLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream: logger.stream }
);