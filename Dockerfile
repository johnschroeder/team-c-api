FROM node:latest

## APPLICATION
ADD . /src/
WORKDIR /src
RUN npm install

EXPOSE 50001

ENTRYPOINT ["npm", "start"]
