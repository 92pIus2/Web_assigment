import {add_user} from "./database/users.js";
import express from "express";
import path from "path"
import bodyParser from "body-parser";
import {fileURLToPath} from 'url';
import {get_products_by_genre} from "./database/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '')));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './first version of view.html'));
});

const items = [
    {id: 1, name: 'Item 1', photo: 'template.png', description: 'Description 1', price: 10.99},
    {id: 2, name: 'Item 2', photo: 'template.png', description: 'Description 2', price: 19.99},
    {id: 3, name: 'Item 3', photo: 'template.png', description: 'Description 3', price: 19.99},
    // Add more items as needed
];

// API endpoint to retrieve items
app.get('/api/content', function (req, res) {
    const items = get_products_by_genre('*').then((products) => {
        console.log(products); // Log the retrieved products by genre
    }).catch((error) => {
        console.error(error); // Handle any errors
    });
    console.log(items);
    res.json(items);
});

app.get('/content', (req, res) => {
    res.sendFile('./index.html');
});

app.post('/registration', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    add_user(email, username, password);

    res.send('Registration successful!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});