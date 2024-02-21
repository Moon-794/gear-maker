const express = require("express")

const app = express();

app.get('/', (req, res) => 
{
    console.log("Get request!");
    res.send('Successful response.');
});

app.listen(3000, () =>
{
    console.log("Server Listening on port 3000.");
})