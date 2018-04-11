FROM node

WORKDIR /var/www/

COPY . /var/www/

RUN npm install

RUN ls -alt

CMD ["node", "app.js"]
