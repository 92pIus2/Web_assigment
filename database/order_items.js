
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

export function add_order_item(id, order_id, product_id, count) {
    const orderItemsRef = database.ref('order_items');

    orderItemsRef.child(id).set({
        id: id,
        order_id: order_id,
        product_id: product_id,
        count: count
    }, (error) => {
        if (error) {
            console.error('Error adding order item:', error);
        } else {
            console.log('Order item added successfully');
        }
    });
}

export function update_order(id, new_status, new_total, new_email) {
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

export function delete_order_item(id) {
    const orderItemRef = database.ref('order_items').child(id);

    orderItemRef.remove((error) => {
        if (error) {
            console.error('Error deleting order item:', error);
        } else {
            console.log('Order item deleted successfully');
        }
    });
}

export function get_order_item_by_id(id) {
    return new Promise((resolve, reject) => {
        const orderItemRef = database.ref('order_items').child(id);

        orderItemRef.once('value', snapshot => {
            const orderItem = snapshot.val();
            resolve(orderItem);
        }, error => {
            console.error('Error getting order item:', error);
            reject(error);
        });
    });
}

export function get_order_items_by_order_id(order_id) {
    return new Promise((resolve, reject) => {
        const orderItemsRef = database.ref('order_items');

        orderItemsRef.orderByChild('order_id').equalTo(order_id).once('value', snapshot => {
            const orderItems = snapshot.val();
            resolve(Object.values(orderItems));
        }, error => {
            console.error('Error getting order items by order ID:', error);
            reject(error);
        });
    });
}

export function get_order_by_product_id(product_id) {
    return new Promise((resolve, reject) => {
        const ordersRef = database.ref('orders');

        ordersRef.orderByChild('order_items/product_id').equalTo(product_id).once('value', snapshot => {
            const orders = snapshot.val();
            resolve(Object.values(orders));
        }, error => {
            console.error('Error getting orders by product ID:', error);
            reject(error);
        });
    });
}