const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, '')));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './first version of view.html'));
});
app.post('/registration', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    res.send('Registration successful!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});