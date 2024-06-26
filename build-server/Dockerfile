FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y node.js

RUN apt-get install git -y

WORKDIR /home/app

COPY main.sh main.sh
COPY package*.json .

RUN npm install

COPY script.js script.js

RUN chmod +x main.sh
RUN chmod +x script.js  

ENTRYPOINT [ "/home/app/main.sh" ]