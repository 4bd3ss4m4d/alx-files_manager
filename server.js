import router from "./routes/index";
import express from "express";

const PORT = +process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/", router);
app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});

module.exports = app;

