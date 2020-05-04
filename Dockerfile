FROM node:12

RUN mkdir /app

# .dockerignore controls which files/directories are not copied
COPY . /app/
WORKDIR /app

# get environment and persist for runtime
ARG ENV=DEV
ENV ENVIRONMENT=$ENV

RUN if [ "$ENVIRONMENT" = "PROD" ] ; then npm install --production; else npm install; fi
RUN if [ "$ENVIRONMENT" = "PROD" ] ; then npm run build; fi

EXPOSE 3000

# If dev or testing: start API and UI
# TODO: If production: build UI, start UI from build files, and start API

CMD if [ "$ENVIRONMENT" = "PROD" ] ; then npm run start:prod ; \
    else npm run start:dev; \
    fi
