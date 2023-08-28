import { get_user_by_username } from "./users.js";
import { get_product_by_id } from "./products.js";
import {add_order_item, get_order_items_by_order_id} from "./order_items.js";

import firebase from "firebase/compat/app";
import {} from "firebase/compat/database";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAORF8cH1QIAuYICrYMtgAwb5UCz4OKgxQ",
    authDomain: "webvinyl-4912c.firebaseapp.com",
    databaseURL: "https://webvinyl-4912c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webvinyl-4912c",
    storageBucket: "webvinyl-4912c.appspot.com",
    messagingSenderId: "1017529934891",
    appId: "1:1017529934891:web:7d3448757b9bc14376b66e",
    measurementId: "G-KDPE4VBBJM"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Add order to database
export function add_order(id, email, total) {
    const ordersRef = database.ref('orders');
    console.log('Adding order: ', id, email, total)
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

// Update order fields by id
export function update_order(id, new_status, new_total, new_email) {
    console.log('Updating order: ', id, new_email, new_total, new_status)
    const orderRef = database.ref('orders').child(id);
    orderRef.update({
        status: new_status,
        total: new_total,
        user_email: new_email
    }, (error) => {
        if (error) {
            console.error('Error updating order:', error);
        } else {
            console.log('Order updated successfully');
        }
    });
}

// Delete order by id
export function delete_order(id) {
    const orderRef = database.ref('orders').child(id);
    console.log('Deleting order: ', id)
    orderRef.remove((error) => {
        if (error) {
            console.error('Error deleting order:', error);
        } else {
            console.log('Order deleted successfully');
        }
    });
}

// Get info about order by id
export function get_order_by_id(id) {
    return new Promise((resolve, reject) => {
        const orderRef = database.ref('orders').child(id);
        orderRef.once('value', snapshot => {
            const order = snapshot.val();
            resolve(order);
        }, error => {
            console.error('Error getting order:', error);
            reject(error);
        });
    });
}

// Get orders by User Email
export function get_orders_by_user(email) {
    return new Promise((resolve, reject) => {
        console.log('Getting orders by email: ', email)
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

// Get products in cart by username
export async function get_products_in_cart(username) {
    console.log('Getting products in cart: ', username)
    try {
        const user = await get_user_by_username(username);

        if (!user) {
            console.error('User not found');
            return [];
        }

        const ordersSnapshot = await database.ref('orders')
            .orderByChild('user_email')
            .equalTo(user.email)
            .once('value');

        const orders = ordersSnapshot.val();

        const cartOrders = Object.values(orders).filter(order => order.status === 'in_cart');

        const productsPromises = cartOrders.map(async order => {
            const orderItemsSnapshot = await database.ref('order_items')
                .orderByChild('order_id')
                .equalTo(order.id)
                .once('value');

            const orderItems = orderItemsSnapshot.val();
            const productPromises = Object.values(orderItems).map(async orderItem => {
                const product = await get_product_by_id(orderItem.product_id);
                return {
                    ...orderItem,
                    product
                };
            });
            return Promise.all(productPromises);
        });

        const products = await Promise.all(productsPromises);
        return products.flat();
    } catch (error) {
        console.error('Error getting products in cart:', error);
        return [];
    }
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
        let order_id;
        if (openCartOrders.length !== 1) {
            // New order for cart
            const ordersSnapshot = await database.ref('orders').once('value');
            const orders = ordersSnapshot.val();

            if (!orders) {
                order_id = 1;
            } else {
                const orderIds = Object.keys(orders).map(id => parseInt(id));
                order_id = Math.max(...orderIds, 0) + 1;
            }
            console.log(order_id)

            const newOrderRef = database.ref('orders').child(order_id);
            add_order(order_id, user.email, 0)
        } else {
            // Cart is already exist
            order_id = openCartOrders[0].id;
        }
        const orderItemRef = database.ref('order_items');
        const orderItemIdSnapshot = await orderItemRef.once('value');
        const orderItemIds = orderItemIdSnapshot.exists() ? Object.keys(orderItemIdSnapshot.val()).map(id => parseInt(id)) : [];
        const order_item_id = Math.max(...orderItemIds, 0) + 1;
        add_order_item(order_item_id, order_id, product_id, count)

        return 'Product successfully added to cart';
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return 'Error adding product to cart';
    }
}


export async function remove_product_from_cart(username, product_id) {
    try {
        const user = await get_user_by_username(username);
        if (!user) {
            console.error('User not found');
            return 'User not found';
        }

        const openCartOrdersSnapshot = await database.ref('orders')
            .orderByChild('user_email')
            .equalTo(user.email)
            .orderByChild('status')
            .equalTo('in_cart')
            .once('value');

        const openCartOrders = openCartOrdersSnapshot.val();

        if (!openCartOrders) {
            console.error('Open cart not found');
            return 'Open cart not found';
        }

        const order_id = Object.keys(openCartOrders)[0];

        const orderItemRef = database.ref('order_items');
        const orderItemsSnapshot = await orderItemRef
            .orderByChild('order_id')
            .equalTo(order_id)
            .orderByChild('product_id')
            .equalTo(product_id)
            .once('value');

        const orderItems = orderItemsSnapshot.val();
        if (!orderItems) {
            console.error('Product not found in cart');
            return 'Product not found in cart';
        }

        const orderItemIds = Object.keys(orderItems);
        await Promise.all(orderItemIds.map(id => orderItemRef.child(id).remove()));

        return 'Product successfully removed from cart';
    } catch (error) {
        console.error('Error removing product from cart:', error);
        return 'Error removing product from cart';
    }
}

export async function update_product_count_in_cart(username, product_id, new_count) {
    try {
        const user = await get_user_by_username(username);
        if (!user) {
            console.error('User not found');
            return 'User not found';
        }

        const openCartOrdersSnapshot = await database.ref('orders')
            .orderByChild('user_email')
            .equalTo(user.email)
            .orderByChild('status')
            .equalTo('in_cart')
            .once('value');

        const openCartOrders = openCartOrdersSnapshot.val();

        if (!openCartOrders) {
            console.error('Open cart not found');
            return 'Open cart not found';
        }

        const order_id = Object.keys(openCartOrders)[0];

        const orderItemRef = database.ref('order_items');
        const orderItemsSnapshot = await orderItemRef
            .orderByChild('order_id')
            .equalTo(order_id)
            .orderByChild('product_id')
            .equalTo(product_id)
            .once('value');

        const orderItems = orderItemsSnapshot.val();
        if (!orderItems) {
            console.error('Product not found in cart');
            return 'Product not found in cart';
        }

        const orderItemIds = Object.keys(orderItems);
        await Promise.all(orderItemIds.map(id => orderItemRef.child(id).update({ count: new_count })));

        return 'Product count in cart successfully updated';
    } catch (error) {
        console.error('Error updating product count in cart:', error);
        return 'Error updating product count in cart';
    }
}

export async function update_cart_status_to_in_progress(username) {
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

export async function get_user_orders(username) {
    try {
        const user = await get_user_by_username(username);
        const ordersIds = await get_orders_by_user(user.email)
        console.log('ids:', ordersIds)
    } catch (error) {
        console.error('Error getting user orders:', error);
        return [];
    }
}

export async function get_in_progress_orders() {
    try {
        const ordersSnapshot = await database.ref('orders')
            .orderByChild('status')
            .equalTo('in_progress')
            .once('value');

        const orders = ordersSnapshot.val();

        const inProgressOrders = await Promise.all(
            Object.values(orders).map(async (order) => {
                const orderItemsSnapshot = await database.ref('order_items')
                    .orderByChild('order_id')
                    .equalTo(order.id)
                    .once('value');

                const orderItems = orderItemsSnapshot.val();
                const productPromises = Object.values(orderItems).map(async (orderItem) => {
                    const product = await get_product_by_id(orderItem.product_id);
                    return {
                        ...orderItem,
                        product
                    };
                });

                const products = await Promise.all(productPromises);

                const total = products.reduce((acc, orderItem) => {
                    return acc + (orderItem.product.price * orderItem.count);
                }, 0);

                return {
                    order_id: order.id,
                    email: order.user_email,
                    products,
                    status: order.status,
                    total: total,
                };
            })
        );

        return inProgressOrders;
    } catch (error) {
        console.error('Error getting in-progress orders:', error);
        return [];
    }
}


export async function isProductInCart(username, product_id) {
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


export async function get_orders_by_status(status) {
    try {
        const ordersSnapshot = await database.ref('orders')
            .orderByChild('status')
            .equalTo(status)
            .once('value');

        const orders = ordersSnapshot.val();

        return Object.values(orders);
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        return [];
    }
}


export async function get_order_items_in_cart(username) {
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
export function updateOrderItemCount(order_item_id, new_count) {
    try {
        const orderItemRef = database.ref('order_items').child(order_item_id);
        orderItemRef.update({ count: new_count });
        console.log('Order item count updated successfully');
    } catch (error) {
        console.error('Error updating order item count:', error);
    }
}

export function updateOrderStatus(order_id, new_status) {
    try {
        const orderRef = database.ref('orders').child(order_id);
        orderRef.update({ status: new_status });
        console.log('Order status updated successfully');
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}