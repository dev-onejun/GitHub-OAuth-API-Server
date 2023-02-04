const express = require('express');
const app = express();
const PORT = 9081;
const cors = require('cors');

const GITHUB_OAUTH_URL = 'http://github.com/login/oauth/access_token';

const axios = require('axios');

require('dotenv').config();

app.use(cors());

var access_token = '';
app.get('/githubOAuthLogin', (request, response) => {

    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
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
