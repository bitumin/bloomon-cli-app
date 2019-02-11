FROM node:8

ENV USER=bitumin

ENV SUBDIR=bloomon

RUN useradd --user-group --create-home --shell /bin/false $USER &&\
    npm i -g npm typescript @types/node

ENV HOME=/home/$USER

COPY package.json tsconfig.json $HOME/$SUBDIR/

RUN chown -R $USER:$USER $HOME/*

USER $USER

WORKDIR $HOME/$SUBDIR

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "build/index.js"]
