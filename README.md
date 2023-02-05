# GitHub OAuth API Server

The server will return `access_token` required to GitHub API.

## Deploy as

### Docker

1. Download using docker

``` bash
$ docker pull ghcr.io/dev-onejun/github-oauth-api:main
```

2. Run the server with `docker run`.

* Example

  * You can run the downloaded docker image like this.

    ``` bash
    $ docker run -d --env CLIENT_SECRET=abc1234def56 -p 80:9081 ghcr.io/dev-onejun/github-oauth-login:main
    ```

### Local

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

## NOTE

* A default port that the server uses is 9081.
* router that you should use

```
/GitHubAccessToken?client_id=${your_github_client_id}&redirect_url=${your_redirect_url}&code=${code_you_received}
```

## NOTICE

This is from the project, SHARE PLATE, which was the part of the server of it. You can check the codes at the branch `hackathon`.\
__However, in this `main` branch, it is developed to use universally.__ You can use this server as the part of your services.
