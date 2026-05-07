const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/deezer-api', createProxyMiddleware({
  target: 'https://api.deezer.com',
  changeOrigin: true,
  pathRewrite: { '^/deezer-api': '' },
}));

app.listen(process.env.PORT || 3000);