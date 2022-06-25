const express = require('express');
const app = express();
const PORT = 9081;

const httpProxy = require('http-proxy');
var githubProxy = httpProxy.createProxyServer({});
var githubUserProxy = httpProxy.createProxyServer({});

const GITHUB_OAUTH_URL = 'http://github.com/login/oauth/access_token';
//const GITHUB_USER_URl = 'https://api.github.com/user';

const { Octokit, App } = require('octokit');

const pool = require('./lib/mysql_config.js');

githubProxy.on('proxyReq', (proxyRequest, request, response) => {
    const code = request.query.code;

    console.log(request.query.code);
    console.log(code);

    const bodyData = {
        client_id           : '17e8286991a1ddce2954',
        client_secret       : '0f2c8b8314ab7523892519ab8db3cb3f5679c3e7',
        code                : code,
    };
    proxyRequest.setHeader('Content-Type', 'application/json');
    proxyRequest.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyRequest.setHeader('Accept', 'application/json');

    proxyRequest.write(bodyData);
});
githubProxy.on('proxyRes', (proxyResponse, request, response) => {

    var proxy_response_body = [];

    proxyResponse.on('data', (d) => {
        proxy_response_body.push(d);
    });
    proxyResponse.on('end', () => {
        data = Buffer.concat(proxy_response_body).toString();
        proxy_response_body = JSON.parse(data);

        const access_token  = proxy_response_body.access_token;
        const scope         = proxy_response_body.scope;
        const token_type    = proxy_response_body.token_type;

        /*githubUserProxy.web(request, response) => {
            target: GITHUB_USER_URL,
            selfHandleResponse: true
        });*/

        const octokit = new Octokit({ auth: access_token });
        const {
            data: { id, avatar_url, name },
        } = octokit.request("GET /user");

        response_data = {
            access_token: id,
        };

        pool.query_insert_user(id, avatar_url, name, (error) => {
            if(error)
                response.end();
            else
                response.end(response_data);
        });
    });
});
app.get('/githubOAuthLogin', (request, response) => {
    githubProxy.web(request, response, {
        target: GITHUB_OAUTH_URL,
        selfHandleResponse: true
    });
});

app.listen(PORT, () => {
    console.log(`app listens on port ${PORT}`);
});
