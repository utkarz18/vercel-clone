FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install

RUN mkdir -p /root/.kube
COPY config /root/.kube/config

COPY src ./src
COPY tsconfig.json .
COPY repo-builder-pod.yaml .

RUN npm run build

CMD [ "node", "dist/index.js" ]