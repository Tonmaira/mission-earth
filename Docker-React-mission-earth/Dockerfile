# Use a base image that includes the necessary dependencies for both Node.js and Nginx
FROM node:20-alpine

# Install Nginx
RUN apk update && apk add nginx tzdata && \
    ln -snf /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && echo Asia/Bangkok > /etc/timezone

# Set the working directory for the Node app
WORKDIR /app

CMD [ "date" ]

# Expose the ports used by Node.js and Nginx
EXPOSE 80 3000 3500 5000

# A script to start both Node.js and Nginx services
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

CMD ["/start-services.sh"]
