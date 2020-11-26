FROM hayd/deno:1.5.2

EXPOSE 8081

WORKDIR /app

USER deno

# Cache the dependencies as a layer (this is re-run only when deps.ts is modified).
# Ideally this will download and compile _all_ external files used in main.ts.
COPY jwt.ts responses.ts /app/
RUN deno cache jwt.ts responses.ts

# These steps will be re-run upon each file change in your working directory:
ADD . /app
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache server.ts

# These are passed as deno arguments when run with docker:
CMD ["run", "--allow-net", "--allow-write", "server.ts"]
