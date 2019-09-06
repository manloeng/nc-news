FROM node:11-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls
EXPOSE 9090
CMD ["npm", "run", "start"]


# FROM postgres
# ENV POSTGRES_DB nc_news
# COPY psql_dump.sql /docker-entrypoint-initdb.d/