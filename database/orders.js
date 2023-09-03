import {create} from "./create.js";
import {get_user_by_username} from "./users.js";
import {get_product_by_id} from "./products.js";
import {add_order_item, get_order_items_by_order_id} from "./order_items.js";

const database = create();

// Add order to database
export function add_order(id, email, total) {
    console.log('Adding order: ', id, email, total)

    const ordersRef = database.ref('orders');
    ordersRef.child(id).set({
        id: id,
        status: 'in_cart', //default status
        total: total,
        user_email: email
    }, (error) => {
        if (error) {
            console.error('Error adding order:', error);
        } else {
            console.log('Order added successfully');
        }
    });
}

// Get orders by User Email
export function get_orders_by_user(email) {
    console.log('Getting orders by email: ', email)

    return new Promise((resolve, reject) => {
        const ordersRef = database.ref('orders');
        ordersRef.orderByChild('user_email').equalTo(email).once('value', snapshot => {
            const orders = snapshot.val();
            resolve(Object.values(orders));
        }, error => {
            console.error('Error getting orders:', error);
            reject(error);
        });
    });
}

// Add product to user's cart
export async function add_product_to_cart(username, product_id, count) {
    console.log('Adding product to cart: ', username, product_id, 'count: ', count)

    try {
        const user = await get_user_by_username(username);
        if (!user) {
            console.error('User not found');
            return 'User not found';
        }

        const userOrdersData = await database.ref('orders')
            .orderByChild('user_email')
            .equalTo(user.email)
            .once('value');

        const userOrders = userOrdersData.val();
        let openCartOrders;
        if (!userOrders)
            openCartOrders = []
        else
            openCartOrders = Object.values(userOrders).filter(order => order.status === 'in_cart');
        let order_id; // id for order
        if (openCartOrders.length !== 1) {
            // New order for cart
            const ordersSnapshot = await database.ref('orders').once('value');
            const orders = ordersSnapshot.val();

            if (!orders) {
                order_id = 1; // for the first order
            } else {
                const orderIds = Object.keys(orders).map(id => parseInt(id));
                order_id = Math.max(...orderIds, 0) + 1; // new ID for a new order
            }
            console.log("New order: ", order_id)
            add_order(order_id, user.email, 0)
        } else {
            // Cart is already exist
            order_id = openCartOrders[0].id; // current ID
            console.log("Cart is exist: ", order_id)
        }
        const orderItemRef = database.ref('order_items');
        const orderItemIdSnapshot = await orderItemRef.once('value');
        const orderItemIds = orderItemIdSnapshot.exists() ? Object.keys(orderItemIdSnapshot.val()).map(id => parseInt(id)) : [];
        const order_item_id = Math.max(...orderItemIds, 0) + 1; // New order_item ID
        add_order_item(order_item_id, order_id, product_id, count) // Create new order_item

        return 'Product successfully added to cart';
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return 'Error adding product to cart';
    }
}

//Update order status from 'in_cart' to 'in_progress'
export async function update_cart_status_to_in_progress(username) {
    console.log('Updating cart status to in_progress: ', username)

    try {
        const user = await get_user_by_username(username);
        if (!user) {
            console.error('User not found');
            return 'User not found';
        }
        const ordersId = await get_orders_by_user(user.email);
        const cartOrders = Object.values(ordersId).filter(order => order.status === 'in_cart');
        await updateOrderStatus(cartOrders[0].id, 'in_progress')
        return 'Cart status successfully updated to "in_progress"';
    } catch (error) {
        console.error('Error updating cart status to in_progress:', error);
        return 'Error updating cart status to in_progress';
    }
}

// Get order history of user
export async function get_user_orders(username) {
    console.log('Getting user orders: ', username)

    try {
        const user = await get_user_by_username(username);
        const allOrders = await get_orders_by_user(user.email)
        const orders = Object.values(allOrders).filter(order => order.status != 'in_cart') // Remove cart order
        const result = []
        for (let i = 0; i < orders.length; ++i) {
            const order = orders[i]
            const orderItems = await get_order_items_by_order_id(order.id)
            const products = []
            let total = 0
            for (let j = 0; j < orderItems.length; ++j) {
                const orderItem = orderItems[j]
                const product = await get_product_by_id(orderItem.product_id)
                const newProduct = {
                    artist : product.artist,
                    album : product.album,
                    count : orderItem.count,
                    price : product.price
                }
                total += product.price * orderItem.count
                products.push(newProduct)
            }
            const newOrder = {
                status : order.status,
                total : total,
                products
            }
            result.push(newOrder)
        }
        return result;
    } catch (error) {
        console.error('Error getting user orders:', error);
        return [];
    }
}

// Get orders with 'in_progress' status for Admin
export async function get_in_progress_orders() {
    console.log('Getting in_progress orders: ')

    try {
        const orders = await get_orders_by_status('in_progress')
        const result = []
        for (let i = 0; i < orders.length; ++i) {
            const order = orders[i]
            const orderItems = await get_order_items_by_order_id(order.id)
            const products = []
            let total = 0
            for (let j = 0; j < orderItems.length; ++j) {
                const orderItem = orderItems[j]
                const product = await get_product_by_id(orderItem.product_id)
                const newProduct = {
                    artist : product.artist,
                    album : product.album,
                    count : orderItem.count,
                    price : product.price
                }
                total += product.price * orderItem.count
                products.push(newProduct)
            }
            const newOrder = {
                order_id : order.id,
                email : order.user_email,
                status : order.status,
                total : total,
                products
            }
            result.push(newOrder)
        }
        return result;
    } catch (error) {
        console.error('Error getting in-progress orders:', error);
        return [];
    }
}

// Check is product already in cart
export async function isProductInCart(username, product_id) {
    console.log('Checking if the product is in the cart: ', username, product_id)

    try {
        const orderItems = await get_order_items_in_cart(username);
        const products = orderItems.map(orderItem => orderItem.id)
        console.log(products)
        return products.includes(product_id)
    } catch (error) {
        console.error('Error checking if the product is in the cart:', error);
        return false;
    }
}

// Get all orders with some status
export async function get_orders_by_status(status) {
    console.log('Getting orders by status:', status)

    try {
        const ordersSnapshot = await database.ref('orders')
            .orderByChild('status')
            .equalTo(status)
            .once('value');

        const orders = ordersSnapshot.val();

        return Object.values(orders);
    } catch (error) {
        console.error('Error getting orders by status:', error);
        return [];
    }
}

// Get order_items from cart by username
export async function get_order_items_in_cart(username) {
    console.log('Getting order items in cart:', username);

    try {
        const user = await get_user_by_username(username);

        if (!user) {
            console.error('User not found');
            return [];
        }

        const openCartOrdersSnapshot = await database.ref('orders')
            .orderByChild('user_email')
            .equalTo(user.email)
            .once('value');

        const openCartOrders = openCartOrdersSnapshot.val();

        if (!openCartOrders) {
            console.error('Open cart not found');
            return [];
        }
        const cartOrders = Object.values(openCartOrders).filter(order => order.status === 'in_cart');
        const order_id = cartOrders[0].id;
        const orderItemRef = database.ref('order_items');
        const orderItemsSnapshot = await orderItemRef
            .orderByChild('order_id')
            .equalTo(order_id)
            .once('value');

        const orderItems = orderItemsSnapshot.val();

        const productsSnapshot = await database.ref('products').once('value');
        const products = productsSnapshot.val();

        return Object.values(orderItems).map(orderItem => {
            const product = products[orderItem.product_id];
            const totalPrice = product.price * orderItem.count;
            return {
                order_item_id: orderItem.id,
                count: orderItem.count,
                ...product,
                totalPrice: totalPrice, // Total price without decimal places (whole number)
            };
        });
    } catch (error) {
        console.error('Error getting order items in cart:', error);
        return [];
    }
}

// Update count in order_item
export function updateOrderItemCount(order_item_id, new_count) {
    console.log('Updating order item count:', order_item_id);

    try {
        const orderItemRef = database.ref('order_items').child(order_item_id);
        orderItemRef.update({ count: new_count });
        console.log('Order item count updated successfully');
    } catch (error) {
        console.error('Error updating order item count:', error);
    }
}

// Update status of order
export function updateOrderStatus(order_id, new_status) {
    console.log('Updating order status:', order_id);

    try {
        const orderRef = database.ref('orders').child(order_id);
        orderRef.update({ status: new_status });
        console.log('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}