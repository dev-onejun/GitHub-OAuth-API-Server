const express = require('express');
const app = express();
const PORT = 9081;

const GITHUB_OAUTH_URL = 'http://github.com/login/oauth/access_token';

const axios = require('axios');
const httpProxy = require('http-proxy');

const pool = require('./lib/mysql_config.js');

var access_token = '';
const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', (proxyRequest, request, response) => {
    proxyRequest.path = '/user';
    proxyRequest.setHeader('Autorization', `token ${request.body.access_token}`);

    console.log(proxyRequest);
    proxyRequest.write();
});
proxy.on('proxyRes', (proxyResponse, request, response) => {
    const id            = proxyResponse.data.id;
    const avatar_url    = proxyResponse.data.avatar_url;
    const name          = proxyResponse.data.name;

    pool.query_insert_user(id, avatar_url, name, error => {
        if(error) {
            const response_data = {
                id: '',
                avatar_url: '',
                name: '',
            };
            response.send(rseponse_data);
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
