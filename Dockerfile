FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install
RUN npm install -g nodemon
# RUN npm run build
RUN ls
# RUN npm run migrate
EXPOSE 3000
CMD [ "npm","run", "dev"]