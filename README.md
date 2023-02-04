# GitHub OAuth API Server

This is from the project, Group Sharing, which was the part of the server of it.

## Download the Docker Image

## Locally Install

1. clone the repository

```
git clone git@github.com:dev-onejun/GitHub-OAuth-API-Server.git
```

2. make `.env` file and fill it as your github secret key.

```
echo CLIENT_ID=$(Please_fill_here_as_your_secret) > .env
echo CLIENT_SECRET=$(Please_fill_here_as_your_secret) >> .env
```

3. run `npm install`

4. run the server as `npm run`
