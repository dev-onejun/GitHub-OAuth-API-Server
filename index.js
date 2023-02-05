const express = require('express');
const app = express();
const PORT = 9081;
const cors = require('cors');

const GITHUB_OAUTH_URL = 'http://github.com/login/oauth/access_token';

const axios = require('axios');

app.use(cors());

app.get('/GitHubAccessToken', (request, response) => {
    const client_secret = process.env.CLIENT_SECRET;

    const client_id = request.query.client_id
    const redirect_url = request.query.redirect_url;
    const code = request.query.code;

    axios({
        method: 'post',
        url: `${GITHUB_OAUTH_URL}?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
        headers: {
            accept: 'application/json'
        },
    }).then((res) => {
        access_token = res.data.access_token;
        response.append('access_token', access_token);
        response.redirect(redirect_url);
    });

});

app.listen(PORT, () => {
    console.log(`app listens on port ${PORT}`);
});
