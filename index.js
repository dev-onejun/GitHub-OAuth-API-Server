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

app.get('/githubOAuthLogin', (request, response) => {
    const client_id = '';
    const client_secret = '';
    const code = request.query.code;

    axios({
        method: 'post',
        url: `${GITHUB_OAUTH_URL}?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
        headers: {
            accept: 'application/json'
        },
    }).then((res) => {
        access_token = res.data.access_token;
        response.redirect('/success');
    });
});
app.get('/success', (request, response) => {
    axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: 'token ' + access_token
        },
    }).then((res) => {
        response.send(res.data);
    });
});

app.listen(PORT, () => {
    console.log(`app listens on port ${PORT}`);
});
