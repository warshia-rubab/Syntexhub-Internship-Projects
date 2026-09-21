const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      let extra = '';
      if (meta && Object.keys(meta).length) {
        extra = ' ' + JSON.stringify(meta);
      }
      return `[${timestamp}] ${level}: ${message}${extra}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

module.exports = logger;