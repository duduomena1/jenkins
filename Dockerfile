FROM node:18-alpine

WORKDIR /app

COPY ./mypipeline/package.json /app/

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]