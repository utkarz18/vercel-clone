FROM ubuntu:focal

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

RUN apt-get install -y nodejs
RUN apt-get install git -y

WORKDIR /home/app

COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src ./src
RUN npm run build
COPY main.sh .

RUN chmod +x main.sh
RUN chmod +x dist/index.js

ENTRYPOINT [ "/home/app/main.sh" ]