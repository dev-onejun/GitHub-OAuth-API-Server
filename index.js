const express = require('express');
const app = express();
const PORT = 9081;
const cors = require('cors');

const GITHUB_OAUTH_URL = 'http://github.com/login/oauth/access_token';

const axios = require('axios');
const httpProxy = require('http-proxy');

const pool = require('./lib/mysql_config.js');

var access_token = '';
const proxy = httpProxy.createProxyServer({});

app.use(cors());

proxy.on('proxyReq', (proxyRequest, request, response) => {
    proxyRequest.path = '/user';
    proxyRequest.setHeader('Autorization', `token ${request.body.access_token}`);
});
proxy.on('proxyRes', (proxyResponse, request, response) => {
    var proxy_response_body = [];

    proxyResponse.on('data', d => {
        proxy_response_body.push(d);
    });

    proxyResponse.on('end', () => {
        data = Buffer.concat(proxy_response_body).toString();
        proxy_response_body = JSON.parse(data);

        const id            = proxy_response_body.data.id;
        const avatar_url    = proxy_response_body.data.avatar_url;
        const name          = proxy_response_body.data.name;

        pool.query_insert_user(id, avatar_url, name, error => {
            if(error){
                const response_data = {
                    id: '',
                    avatar_url: '',
                    name: '',
                };
                response.send(response_data);
            }
            else {
                const response_data = {
                    id: id,
                    avatar_url: avatar_url,
                    name: name,
                };
                response.send(response_data);
            }
        });
    });
});
app.get('/githubOAuthLogin', (request, response) => {
    const client_id = '17e8286991a1ddce2954';
    const client_secret = '0f2c8b8314ab7523892519ab8db3cb3f5679c3e7';
    const code = request.query.code;

    axios({
        method: 'post',
        url: `${GITHUB_OAUTH_URL}?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
        headers: {
            accept: 'application/json'
        },
    }).then((res) => {
        request.body = {
            access_token: res.data.access_token,
        };

        proxy.web(request, response, {
            target: 'http://api.github.com',
            selfHandleResponse: true
        });
    });
});

app.listen(PORT, () => {
    console.log(`app listens on port ${PORT}`);
});
