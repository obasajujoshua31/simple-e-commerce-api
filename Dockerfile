FROM node:alpine

COPY package.json .

COPY  yarn.lock .

RUN yarn install

COPY . .

RUN chmod 755 start.sh

EXPOSE 5500

CMD  [ "/bin/sh", "start.sh" ]
