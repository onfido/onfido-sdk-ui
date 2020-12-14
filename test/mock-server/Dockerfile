FROM hayd/deno:1.5.2

EXPOSE 8080

WORKDIR /app

USER deno

COPY *.ts *.pem lock.json /app/
COPY /frontend/* /app/frontend/
RUN deno cache deps.ts --lock=lock.json

# CMD ["run", "--allow-net", "--allow-read", "https://deno.land/std/http/file_server.ts"]
CMD ["run", "--allow-net", "--allow-read", "--allow-write", "server.ts"]
