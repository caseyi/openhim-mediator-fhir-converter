#########################################
### Base Image                         ##
#########################################
FROM node:14 AS build

WORKDIR /app

COPY ./package.json /app 
COPY ./.eslintrc.js /app
COPY ./tsconfig.json /app

RUN yarn install

COPY ./src /app/src

RUN yarn build

#########################################
### Prod Image                         ##
#########################################
FROM node:14
RUN  apt-get update && apt install libcurl3 libcurl4-gnutls-dev -y && apt autoremove -y

COPY --from=build /app /app
COPY ./deploy /app/deploy
COPY ./data /app/data
COPY ./static /app/static

WORKDIR /app
RUN ["chmod", "+x", "/app/deploy/webapp.sh"]
EXPOSE 2019
ENTRYPOINT [ "./deploy/webapp.sh" ]
