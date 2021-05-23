const express = require("express");
const app = express();

app.use(express.json())
app.use(express.static("public_html"));


app.get('/', (req, res) => {
    res.send("Welcome to the home page")
});

app.listen(3000, () => {
    console.log(`Server is up!!! :)`);
});

