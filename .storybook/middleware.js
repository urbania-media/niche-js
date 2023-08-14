import dotenv from 'dotenv';

import apiMiddleware from './api/middleware';
import proxyMiddleware from './api/proxy';

dotenv.config();

// For local API with micromag.studio
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default (router) => {
    const proxyUrl = process.env.API_PROXY_URL || null;

    if (proxyUrl !== null) {
        router.use('/api', proxyMiddleware(proxyUrl));
    } else {
        router.use('/api', apiMiddleware());
    }
};
