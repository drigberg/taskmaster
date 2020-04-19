FROM node:12

RUN mkdir /app
COPY package.json package-lock.json /app/
WORKDIR /app
RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]
