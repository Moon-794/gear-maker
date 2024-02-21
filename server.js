const express = require("express")

const app = express();
app.use(express.static("./public"))

app.get('/', (req, res) => 
{
    res.sendFile("src/views/app.html", {root: __dirname});
});

app.listen(3000, () =>
{
    console.log("Server Listening on port 3000.");
})