const express = require('express')
const app = express()
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PropertyRouter = require("./routes/PropertyRouter");
const port = 2607

//database connection
dbConnect();

//config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//routes
app.use("/user", UserRouter);
app.use("/property", PropertyRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/uploads", express.static('./uploads'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})