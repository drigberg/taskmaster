FROM node:12

RUN mkdir /app
COPY .env package.json package-lock.json lib public src tests /app/
WORKDIR /app

ARG ENV=DEV
RUN if [ "$ENV" = "PROD" ] ; then npm install --production; else npm install; fi

EXPOSE 3000

# If dev or testing: start API and UI
# TODO: If production: build UI, start UI from build files, and start API

CMD if [ "$ENV" = "PROD" ] ; then npm run start:prod ; \
    else npm run start:dev; \
    fi
