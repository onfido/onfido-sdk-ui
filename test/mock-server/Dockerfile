FROM denoland/deno:1.16.1

EXPOSE 8080

WORKDIR /app

USER deno

COPY *.ts *.pem lock.json /app/
COPY /frontend/* /app/frontend/
RUN deno cache deps.ts --lock=lock.json

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "server.ts"]
