# Base image
FROM node:18-alpine

# Working directory set karein
WORKDIR /app

# Dependencies copy aur install karein
COPY package*.json ./
RUN npm install

# Baaki ka source code copy karein
COPY . .

# Port expose karein
EXPOSE 8000

# App start karein
CMD ["npm", "run", "dev"]