const express = require('express')
const app = express()
const cors = require("cors");
const fs = require('fs');
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const port = 2607

//database connection
dbConnect();

//config
app.use(cors());
app.use(express.json());

//routes
app.use("/user", UserRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})