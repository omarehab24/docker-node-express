const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const os = require("os");

const redis = require("redis");
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOST = 'redis'
const redisClient = redis.createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

redisClient.on('error', err => console.log('Redis Client Error', err))
redisClient.on('connect', () => {
    console.log('connected to redis')
})
redisClient.connect();

// const mongoose = require("mongoose");
// const DB_NAME = 'root'
// const DB_PASSWORD = 'example'
// const DB_PORT = '27017'
// const DB_HOST = "mongo" // Docker automatically maps the service/container name to the container's IP address

// const URI = `mongodb://${DB_NAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
// mongoose.connect(URI).then(() => console.log("connected to DB")).catch((err) => console.log(err))

const { Client } = require('pg')
const DB_NAME = 'root'
const DB_PASSWORD = 'example'
const DB_PORT = '5432'
const DB_HOST = "postgres" // Docker automatically maps the service/container name to the container's IP address

const URI = `postgresql://${DB_NAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`
const client = new Client({
    connectionString: URI,
})
client.connect().then(() => console.log("connected to Postgres DB")).catch((err) => console.log(err))




app.get("/", (req, res) => {
    console.log(`traffic received from ${os.hostname}`);
    redisClient.set('products', 'product1, product2, product3');
    res.send("<h1>Hello World!!!!</h1>");
});

app.get("/data", async (req, res) => {
    const data = await redisClient.get('products');
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







