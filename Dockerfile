# BUILDER IMAGE
FROM node:12.16.3-buster AS builder
ENV JOBS="max"
WORKDIR /usr/src/app
# important, otherwise postinstall hook fails
RUN npm set unsafe-perm=true
RUN npm set progress=false
RUN npm set loglevel=error
# now copy all relevant files
COPY .env.jsonc package.json package-lock.json tsconfig.json jest.config.js tslint.json ./
COPY src ./src
# install dependencies first
RUN npm ci
# now compile typescript
RUN npm run build

# MAIN IMAGE
FROM node:12.16.3-buster
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
EXPOSE 3000
USER node
CMD [ "npm", "start" ]
