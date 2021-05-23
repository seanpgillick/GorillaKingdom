const express = require("express");
const app = express();
const port = process.env.port || 3000;

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Welcome to the home page")
});

app.listen(port, () => {
    console.log(`Listening at port: ${port}!!! :)`);
});