FROM hayd/deno:1.5.2

EXPOSE 8081

WORKDIR /app

USER deno

COPY *.ts lock.json /app/
RUN deno cache deps.ts --lock=lock.json

CMD ["run", "--allow-net", "--allow-write", "server.ts"]
