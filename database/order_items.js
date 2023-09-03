import {create} from "./create.js";

// Open Database
const database = create();

// Add order_item to Database
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

// Delete order_item from Database
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

// Get all order_items by ID of order
export function get_order_items_by_order_id(order_id) {
    return new Promise((resolve, reject) => {
        const orderItemsRef = database.ref('order_items');

        orderItemsRef.orderByChild('order_id').equalTo(order_id).once('value', snapshot => {
            const orderItems = snapshot.val();
           // console.log(orderItems)
            resolve(Object.values(orderItems));
        }, error => {
            console.error('Error getting order items by order ID:', error);
            reject(error);
        });
    });
}
