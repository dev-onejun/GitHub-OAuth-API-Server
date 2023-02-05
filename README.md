# GitHub OAuth API Server

The server will return `access_token` required to GitHub API.

## Download as the Docker Image

### NOTE

* A default port that the server uses is 9081.
* router that you should use

```
/GitHubAccessToken?client_id=${your_github_client_id}&redirect_url=${your_redirect_url}&code=${code_you_received}
```

Please set your expose port privately.\
\
You can run the downloaded docker image like this.

```
docker run -d --env CLIENT_SECRET=abc1234def56 -p 80:9081 ghcr.io/dev-onejun/github-oauth-login:main
```

## Locally Install

1. clone the repository

```
git clone git@github.com:dev-onejun/GitHub-OAuth-API-Server.git
```

2. set GitHub `CLIENT_SECRET` as an environment variable.

``` bash
$ export CLIENT_SECRET=$(Please_fill_here_as_your_secret)
```

3. run `npm install`

4. run the server as `npm run-script run`

## NOTICE

This is from the project, SHARE PLATE, which was the part of the server of it.\
However, in this `main` branch, it is developed to use universally.\
You can use this server as the part of your services.
