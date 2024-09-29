import router from "./routes/index";
import express from "express";

const PORT = +process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use("/", router);
server.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});

module.exports = server;

