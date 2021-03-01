FROM node:0.10

WORKDIR /var/www/

COPY . /var/www/

RUN npm install

RUN ls -alt

CMD ["node", "app.js"]
