FROM denoland/deno:1.16.1

EXPOSE 8081
EXPOSE 8082

WORKDIR /app

USER deno

COPY cert.pem key.pem /app/
COPY *.ts lock.json /app/
COPY /frontend /app/frontend
RUN deno cache deps.ts --lock=lock.json

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "server.ts"]
