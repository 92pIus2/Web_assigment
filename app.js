import express from "express";
import session from "express-session"
import path from "path"
import bodyParser from "body-parser";

import {engine} from 'express-handlebars';
import {fileURLToPath} from "url";

import {delete_order_item} from "./database/order_items.js";
import {add_user, checkPassword, get_user_by_username, update_user_by_username} from "./database/users.js";
import {get_all_products} from "./database/products.js";
import {
    add_product_to_cart,
    get_order_items_in_cart, get_user_orders, isProductInCart,
    update_cart_status_to_in_progress, updateOrderItemCount
} from "./database/orders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//app.set('view engine', 'html'); this is for fast rollback, bacause now we use templating engine

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

app.get('/', (req, res) => {
    res.render('login');
});

// API endpoint to retrieve items
app.get('/api/cart', (req, res) => {
    get_order_items_in_cart(req.session.username)
        .then((orderItems) => {
            res.json(orderItems);
        })
        .catch((error) => {
            console.error(error); // Handle any errors
            res.status(500).json({message: 'An error occurred while retrieving cart items.'});
        });
});

app.get('/account', (req, res) => {
    if (!req.session.loggedin) {
        res.render('content', {
            loggedIn: req.session.loggedin
        });
    } else {
        res.render('account', {
            loggedIn: req.session.loggedin,
            username: req.session.username
        });
    }
});

app.get('/api/items', (req, res) => {
    get_all_products().then((products) => {
        //console.log(products); // Log the retrieved products by genre
        res.json(products);
    }).catch((error) => {
        console.error(error); // Handle any errors
    });
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/content', (req, res) => {
    res.render('content', {
        loggedIn: req.session.loggedin,
        test: "test"
    });
});

app.get('/cart', (req, res) => {
    res.render('cart', {
        loggedIn: req.session.loggedin,
        test: "test"
    });
});

app.get('/admin', (req, res) => {
    if (req.session.username === "admin") {
        res.render('admin_tree');
    } else {
        res.redirect('/content');
    }
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
                    if (username === "admin") {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/content');
                    }
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
    if (req.session.loggedin) {
        isProductInCart(req.session.username, itemId).then((isInCart) => {
            console.log(itemId, " ",isInCart)
            if (isInCart) {
                res.json({message: `Product is already in cart, if you want to change count of items change it in cart`});
            } else {
                add_product_to_cart(req.session.username, itemId, req.body.count).then((ans) => {
                    console.log(ans);
                }).catch((error) => {
                    console.error(error);
                    res.json({message: `Error occurred`});
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        res.json({message: `You need to log in!`});
    }
})

app.delete('/api/cart/:itemId', (req, res) => {
    const itemId = req.params.itemId;

    // Call the delete_order_item function from order_items.js
    delete_order_item(itemId)
    res.redirect("/cart")
});

app.post('/api/orders/update_cart_status_to_in_progress', (req, res) => {
    // Call the function to update cart status to "In Progress"
    update_cart_status_to_in_progress(req.session.username)
        .then(() => {
            res.json({message: "Cart status updated to In Progress"});
        })
        .catch((error) => {
            console.error(error);
            res.json({message: "Error occurred while updating cart status"});
        });
});

app.patch('/api/cart/update_count/:orderItemId', (req, res) => {
    const orderItemId = req.params.orderItemId;
    const newQuantity = req.body.quantity;

    updateOrderItemCount(orderItemId, newQuantity);
    res.redirect("/cart")
});

app.post('/update_user_by_username', (req, res) => {
    // Extract data from the request body
    const { username, newUsername, newPassword } = req.body;
    if (username === req.session.username) {
        // Call the update_user_by_username function to update the user's data
        update_user_by_username(username, newUsername, newPassword)
        req.session.username = newUsername;
    }
});

app.get('/get_user_email', (req, res) => {
    const username = req.session.username;
    console.log(username);
    // Call the get_user_by_username function to fetch the user's email
    get_user_by_username(username)
        .then(user => {
            console.log(user)
            if (user) {
                // User found, send the email in the response
                console.log(user.email)
                res.json({ email: user.email });
            } else {
                // User not found, send an error response
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching user email:', error);
            res.status(500).json({ error: 'An error occurred while fetching user email' });
        });
});

app.get('/get_user_orders', async (req, res) => {
    try {
        const  username = req.session.username;
        // Assuming you have a variable "username" containing the currently logged-in username
        // const username = '...'; // Replace this with the currently logged-in username

        const orders = await get_user_orders(username);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: 'An error occurred while fetching user orders' });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});