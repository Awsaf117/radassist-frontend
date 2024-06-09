# Stage 1

### pull node image with alpine
FROM node:latest as react-build
RUN mkdir -p /app
COPY . ./app
WORKDIR /app
RUN yarn install
RUN yarn yarn-build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]