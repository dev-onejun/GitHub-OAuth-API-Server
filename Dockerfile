FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run-script", "run" ]

EXPOSE 9081
