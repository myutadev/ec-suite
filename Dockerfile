FROM node:18.16.0
WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \ 
    then npm install; \ 
    else npm install --only=production; \
    fi
COPY . ./
EXPOSE $PORT
CMD ["npm", "start"]
