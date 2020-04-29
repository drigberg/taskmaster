FROM node:12

RUN mkdir /app
COPY .env package.json package-lock.json lib public src tests /app/
WORKDIR /app
RUN npm install

EXPOSE 3000

CMD npm start
