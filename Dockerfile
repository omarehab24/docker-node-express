# Multi stage build

# Base stage that will be used in other stages
FROM node:22-alpine3.19 AS base

# Set the working directory of the container
WORKDIR /app
# COPY package.json into the container, in this case it will be copied to /app
# Why do we need to copy the package.json file first, instead of COPY . . then RUN npm install?
# Because if we COPY . . then RUN npm install first, docker will copy all the files including the package.json file, it will rebuild the image since files changed, hence won't be cached, each time we run the container, it will install the dependencies again.
# So when we copy the package.json file first, it will be cached, if not modified, the layer won't be rebuilt, hence won't have to install the dependencies again.
COPY package.json .

# Set the target stage
FROM base AS development

# Install dependencies
RUN npm install
# Copy the rest of the files in this folder to the container
# In case some files are not need, specify them in the .dockerignore file
COPY . .
# Expose the port on which the app will run in the container
EXPOSE 4000
# Run the app
CMD ["npm", "run" ,"start-dev"]

FROM base AS production

RUN npm install --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "run" ,"start"]