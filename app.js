import {add_user, checkPassword, get_user_by_username} from "./database/users.js";
import express from "express";
import session from "express-session"
import path from "path"
import bodyParser from "body-parser";
import {fileURLToPath} from "url";
import {add_product, get_products_by_genre} from "./database/products.js";
import {add_product_to_cart, get_products_in_cart} from "./database/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, '')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(
    session({
        resave: false,
        secret: '3f0B4Cb47bKd67nSFD5',
        saveUninitialized: true,
    })
);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './authorization_form.html'));
});

// API endpoint to retrieve items

app.get('/api/cart', (req, res) => {
    get_products_in_cart(req.session.username).then((products) => {
        console.log(products); // Log the retrieved products by genre
        res.json(products);
    }).catch((error) => {
        console.error(error); // Handle any errors
    });
});

app.get('/api/content', function (req, res) {
    get_products_by_genre('Hip-Hop').then((products) => {
        console.log(products); // Log the retrieved products by genre
        res.json(products);
    }).catch((error) => {
        console.error(error); // Handle any errors
    });
});

app.get('/registration', (req, res) => {
    res.sendFile('./index.html');
});

app.get('/content', (req, res) => {
    res.sendFile('./index.html');
});

app.post('/registration', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    add_user(email, username, password);

    //res.send('Registration successful!');
    res.redirect("/");
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    get_user_by_username(username).then((user) => {
        console.log(user); // Log the retrieved user by username
        if (user != null) {
            checkPassword(username, password).then((status) => {
                console.log(status);
                if (status) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/content');
                } else {
                    alert("Wrong password, try again!");
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            res.send(`No ${username} registered`);
        }
    }).catch((error) => {
        console.error(error); // Handle any errors
    });
})

app.post('/add_to_cart', (req, res) => {
    const itemId = req.body.id;
    add_product_to_cart(req.session.username, itemId, 1).then((ans) => {
        console.log(ans);
        res.json({message: `Added ${itemId} to cart`});
    }).catch((error) => {
       console.error(error);
       res.json({message: `Error occurred`});
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});