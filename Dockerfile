FROM node:17-alpine AS base

WORKDIR /opt/app
COPY package.json /opt/app

ENV BOT_TOKEN=""
ENV DATABASE_URL=""
ENV REDIS_URL=""

RUN npm install

FROM base AS build

COPY . /opt/app
RUN ["./scripts/build.sh"]

FROM base as production

COPY --from=build /opt/app/package.json /opt/app/package.json
COPY --from=build /opt/app/node_modules /opt/app/node_modules
COPY --from=build /opt/app/build /opt/app/build
COPY --from=build /opt/app/scripts /opt/app/scripts
COPY --from=build /opt/app/prisma /opt/app/prisma

CMD ["./scripts/start.sh"]
