FROM hayd/deno:1.5.2

EXPOSE 8080

WORKDIR /home/app

USER deno

COPY *.ts *.pem lock.json /home/app/
COPY /home/frontend/* /home/app/frontend/
RUN deno cache deps.ts --lock=lock.json

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "server.ts"]
