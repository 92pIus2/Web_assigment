import { json, send } from 'micro';
import { parse } from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express'; // Import express as default

import { add_user, checkPassword, get_user_by_username } from './database/users.js';
import { add_product_to_cart, get_products_in_cart } from './database/orders.js'; // Corrected import
import { add_product, get_products_by_genre } from './database/products.js';
import { print_users, print_products } from './database/test.js';
import session from 'express-session';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '')));

// Add the express.json() and express.urlencoded() middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        resave: false,
        secret: '3f0B4Cb47bKd67nSFD5',
        saveUninitialized: true,
    })
);

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    const loginPage = fs.readFileSync(filePath, 'utf8');
    return res.send(loginPage);
});

// API endpoint to retrieve items

app.get('/api/cart', async (req, res) => {
    try {
        const products = await get_products_in_cart(req.session.username);
        console.log(products);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/content', async (req, res) => {
    try {
        const products = await get_products_by_genre('Hip-Hop');
        console.log(products);
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/registration', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    const registrationPage = fs.readFileSync(filePath, 'utf8');
    return res.send(registrationPage);
});

app.get('/content', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    const contentPage = fs.readFileSync(filePath, 'utf8');
    return res.send(contentPage);
});

app.post('/registration', async (req, res) => {
    const { username, password, email } = req.body;

    add_user(email, username, password);

    return res.redirect("/");
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await get_user_by_username(username);

        if (user != null) {
            const status = await checkPassword(username, password);

            if (status) {
                req.session.loggedin = true;
                req.session.username = username;
                return res.redirect('/content');
            } else {
                return res.status(400).send('Wrong password, try again!');
            }
        } else {
            return res.status(404).send(`No ${username} registered`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/add_to_cart', async (req, res) => {
    const { id: itemId } = req.body;

    try {
        const ans = await add_product_to_cart(req.session.username, itemId, 1);
        console.log(ans);
        return res.json({ message: `Added ${itemId} to cart` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Wrap the express app with micro
const handler = (req, res) => app(req, res);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
