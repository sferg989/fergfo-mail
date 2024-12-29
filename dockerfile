# Use Node.js with TypeScript support
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the application port (not necessary for IMAP but good practice)
EXPOSE 3000

# Run the app
CMD ["node", "dist/app.js"]
