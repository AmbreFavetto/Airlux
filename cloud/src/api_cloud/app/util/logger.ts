import logger from 'pino';

const log = logger({
  base: { pid: false },
  transport: {
    target: 'pino-pretty',
    options: {
      colorized: true
    }
  },
  timestamp: () => `,"time": "${new Date().toLocaleString()}"`
});

if (process.env.NODE_ENV === 'test') {
  log.level = 'silent'
}

export default log;
