import { createProxyMiddleware } from 'http-proxy-middleware';

export default (proxy) =>
    createProxyMiddleware({
        target: proxy,
        changeOrigin: true,
        followRedirects: true,
        secure: false,
    });
