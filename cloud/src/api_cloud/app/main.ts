import app from "./index";
import dotenv from 'dotenv';
import ip from 'ip';
import logger from './util/logger';

dotenv.config();

const start = (port: Number) => {
    try {
        app.listen(port, () => logger.info(`Server running on: ${ip.address()}:${port}`));
    } catch (err) {
        console.error(err);
        process.exit();
    }
};

start(Number(process.env.SERVER_PORT));