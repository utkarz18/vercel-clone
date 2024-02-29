FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY tsconfig.json .
COPY src ./src
RUN npm run build

COPY git-repo-builder-pod.yaml .
COPY git-repo-builder-pod-dev.yaml .

CMD [ "node", "dist/index.js" ]