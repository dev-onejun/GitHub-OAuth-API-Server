const express = require('express');
const app = express();
const port = 9081;


app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`app listens on port ${port}`);
});
