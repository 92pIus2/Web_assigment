import {add_user, checkPassword, get_user_by_username} from "./database/users.js";
import express from "express";
import session from "express-session"
import path from "path"
import bodyParser from "body-parser";
import {fileURLToPath} from "url";
import {add_product, get_all_products, get_products_by_genre} from "./database/products.js";
import {
    add_product_to_cart,
    get_order_items_in_cart,
    get_products_in_cart,
    update_cart_status_to_in_progress, updateOrderItemCount
} from "./database/orders.js";
import {delete_order_item} from "./database/order_items.js";

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
    get_order_items_in_cart(req.session.username)
        .then((orderItems) => {
            res.json(orderItems);
        })
        .catch((error) => {
            console.error(error); // Handle any errors
            res.status(500).json({ message: 'An error occurred while retrieving cart items.' });
        });
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
    add_product_to_cart(req.session.username, itemId, req.body.count).then((ans) => {
        console.log(ans);
        res.json({message: `Added ${itemId} to cart`});
    }).catch((error) => {
       console.error(error);
       res.json({message: `Error occurred`});
    });
})

app.delete('/api/cart/:itemId', (req, res) => {
    const itemId = req.params.itemId;

    // Call the delete_order_item function from order_items.js
    delete_order_item(itemId)
});

app.post('/api/orders/update_cart_status_to_in_progress', (req, res) => {
    // Call the function to update cart status to "In Progress"
    update_cart_status_to_in_progress(req.session.username)
        .then(() => {
            res.json({ message: "Cart status updated to In Progress" });
        })
        .catch((error) => {
            console.error(error);
            res.json({ message: "Error occurred while updating cart status" });
        });
});

app.patch('/api/cart/update_count/:orderItemId', (req, res) => {
    const orderItemId = req.params.orderItemId;
    const newQuantity = req.body.quantity;

    // Your logic to update the item count in the cart on the server
    // You can call the updateOrderItemCount function here passing the necessary data
    updateOrderItemCount(orderItemId, newQuantity);

});
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});