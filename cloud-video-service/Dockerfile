# Stage 1: Build stage
FROM node:18 AS builder
# Set the working directory in the container to /app
WORKDIR /app
COPY package*.json ./
# Install any needed packages specified in package.json
RUN npm install
# Bundle app source inside the docker image
COPY . .
# Build the app
RUN npm run build
# Stage 2: Production stage
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install 
# Copy built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app
CMD ["npm", "start"]
