import mysql from 'mysql'


const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7634155',
    password: 'twVQVPvpFA',
    database: 'sql7634155'
});

connection.connect((error) => {
    if (error) {
        console.error('Ошибка подключения к базе данных:', error);
        return;
    }
    console.log('Подключено к базе данных MySQL');
});

//id
//status
//total
//user_email
export function add_order(id, email, total){
    // SQL-запрос для вставки данных
    const insertQuery = `
  INSERT INTO orders (id, status, total, user_email)
  VALUES (?, ?, ?, ?)
`;
    const values = [id, 'in_cart', total, email];

    // Выполнение SQL-запроса для вставки данных
    connection.query(insertQuery, values, (error) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return;
        }
        console.log('Данные вставлены успешно');
    });
}

export function update_order(id, new_status, new_total, new_email) {

// Выполняем SQL-запрос для обновления данных
    const updateQuery = 'UPDATE orders SET status = ?, total = ?, user_email = ? WHERE id = ?';

    connection.query(updateQuery, [new_status, new_total, new_email, id], (error, results) => {
        if (error) {
            console.error('Ошибка при обновлении данных:', error);
            // Обработка ошибки
        } else {
            console.log('Данные успешно обновлены!');
            // Дополнительные действия при успешном обновлении данных
        }
    });
}

export function delete_order(id) {
    // SQL-запрос для удаления данных
    const deleteQuery = 'DELETE FROM orders WHERE id = ?';

    // Выполнение SQL-запроса для удаления данных
    connection.query(deleteQuery, [id], (error, results) => {
        if (error) {
            console.error('Ошибка при удалении заказа:', error);
            return;
        }
        console.log('Заказ успешно удален');
    });
}

export function get_order_by_id(id) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения заказа по ID
        const selectQuery = 'SELECT * FROM orders WHERE id = ?';

        // Выполнение SQL-запроса для получения заказа
        connection.query(selectQuery, [id], (error, results) => {
            if (error) {
                console.error('Ошибка при получении заказа:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results[0]);
        });
    });
}

export function get_orders_by_user(email) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения заказов по email пользователя
        const selectQuery = 'SELECT * FROM orders WHERE user_email = ?';

        // Выполнение SQL-запроса для получения заказов
        connection.query(selectQuery, [email], (error, results) => {
            if (error) {
                console.error('Ошибка при получении заказов:', error);
                reject(error);
                return;
            }
            // Возвращаем результаты
            resolve(results);
        });
    });
}

export function get_products_in_cart(username) {
    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT order_items.*, products.*
            FROM order_items
            JOIN orders ON order_items.order_id = orders.id
            JOIN products ON order_items.product_id = products.id
            JOIN users ON orders.user_email = users.email
            WHERE users.username = ? AND orders.status = 'in_cart'
        `;

        connection.query(selectQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении элементов заказа в корзине:', error);
                reject(error);
                return;
            }

            resolve(results);
        });
    });
}

export function get_order_items_in_cart(username) {
    return new Promise((resolve, reject) => {
        const selectQuery = `
            SELECT order_items.id AS order_item_id, order_items.count, products.*
            FROM order_items
            JOIN orders ON order_items.order_id = orders.id
            JOIN products ON order_items.product_id = products.id
            JOIN users ON orders.user_email = users.email
            WHERE users.username = ? AND orders.status = 'in_cart'
        `;

        connection.query(selectQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении элементов заказа в корзине:', error);
                reject(error);
                return;
            }

            resolve(results);
        });
    });
}



export function add_product_to_cart(username, product_id, count) {
    return new Promise((resolve, reject) => {
        // Get the user's email based on the username
        const getUserEmailQuery = 'SELECT email FROM users WHERE username = ?';

        connection.query(getUserEmailQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении email пользователя:', error);
                reject(error);
                return;
            }

            if (results.length === 0) {
                console.error('Пользователь не найден');
                reject('Пользователь не найден');
                return;
            }

            const user_email = results[0].email;

            // Check if there is an open cart for the user
            const getOpenCartQuery = 'SELECT * FROM orders WHERE user_email = ? AND status = "in_cart"';

            connection.query(getOpenCartQuery, [user_email], (error, results) => {
                if (error) {
                    console.error('Ошибка при проверке открытой корзины:', error);
                    reject(error);
                    return;
                }

                let order_id;

                if (results.length === 0) {
                    // If no open cart exists, create a new cart for the user
                    const getLastOrderIdQuery = 'SELECT MAX(id) AS last_id FROM orders';
                    connection.query(getLastOrderIdQuery, (error, results) => {
                        if (error) {
                            console.error('Ошибка при получении последнего ID заказа:', error);
                            reject(error);
                            return;
                        }

                        order_id = results[0].last_id + 1;

                        // Check the last id in order_items table as well
                        const getLastOrderItemIdQuery = 'SELECT MAX(id) AS last_order_item_id FROM order_items';
                        connection.query(getLastOrderItemIdQuery, (error, results) => {
                            if (error) {
                                console.error('Ошибка при получении последнего ID элемента заказа:', error);
                                reject(error);
                                return;
                            }

                            const order_item_id = results[0].last_order_item_id + 1;

                            const createCartQuery = 'INSERT INTO orders (id, status, user_email) VALUES (?, "in_cart", ?)';
                            connection.query(createCartQuery, [order_id, user_email], (error) => {
                                if (error) {
                                    console.error('Ошибка при создании новой корзины:', error);
                                    reject(error);
                                    return;
                                }

                                addOrderItem(order_item_id, order_id, product_id, count);
                                resolve('Товар успешно добавлен в корзину');
                            });
                        });
                    });
                } else {
                    // Use the existing open cart for the user
                    order_id = results[0].id;

                    // Check the last id in order_items table as well
                    const getLastOrderItemIdQuery = 'SELECT MAX(id) AS last_order_item_id FROM order_items';
                    connection.query(getLastOrderItemIdQuery, (error, results) => {
                        if (error) {
                            console.error('Ошибка при получении последнего ID элемента заказа:', error);
                            reject(error);
                            return;
                        }

                        const order_item_id = results[0].last_order_item_id + 1;
                        addOrderItem(order_item_id, order_id, product_id, count);
                        resolve('Товар успешно добавлен в корзину');
                    });
                }
            });
        });
    });
}




function addOrderItem(id, order_id, product_id, count) {
    const insertQuery = 'INSERT INTO order_items (id, order_id, product_id, count) VALUES (?, ?, ?, ?)';

    connection.query(insertQuery, [id, order_id, product_id, count], (error) => {
        if (error) {
            console.error('Ошибка при добавлении элемента заказа:', error);
        }
    });
}

export function remove_product_from_cart(username, product_id) {
    return new Promise((resolve, reject) => {
        // Get the user's email based on the username
        const getUserEmailQuery = 'SELECT email FROM users WHERE username = ?';

        connection.query(getUserEmailQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении email пользователя:', error);
                reject(error);
                return;
            }

            if (results.length === 0) {
                console.error('Пользователь не найден');
                reject('Пользователь не найден');
                return;
            }

            const user_email = results[0].email;

            // Get the open cart for the user
            const getOpenCartQuery = 'SELECT * FROM orders WHERE user_email = ? AND status = "in_cart"';

            connection.query(getOpenCartQuery, [user_email], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении открытой корзины:', error);
                    reject(error);
                    return;
                }

                if (results.length === 0) {
                    console.error('Открытая корзина не найдена');
                    reject('Открытая корзина не найдена');
                    return;
                }

                const order_id = results[0].id;
                removeOrderItem(order_id, product_id);

                resolve('Товар успешно удален из корзины');
            });
        });
    });
}

function removeOrderItem(order_id, product_id) {
    const deleteQuery = 'DELETE FROM order_items WHERE order_id = ? AND product_id = ?';

    connection.query(deleteQuery, [order_id, product_id], (error) => {
        if (error) {
            console.error('Ошибка при удалении элемента заказа:', error);
        }
    });
}

export function update_product_count_in_cart(username, product_id, new_count) {
    return new Promise((resolve, reject) => {
        // Get the user's email based on the username
        const getUserEmailQuery = 'SELECT email FROM users WHERE username = ?';

        connection.query(getUserEmailQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении email пользователя:', error);
                reject(error);
                return;
            }

            if (results.length === 0) {
                console.error('Пользователь не найден');
                reject('Пользователь не найден');
                return;
            }

            const user_email = results[0].email;

            // Get the open cart for the user
            const getOpenCartQuery = 'SELECT * FROM orders WHERE user_email = ? AND status = "in_cart"';

            connection.query(getOpenCartQuery, [user_email], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении открытой корзины:', error);
                    reject(error);
                    return;
                }

                if (results.length === 0) {
                    console.error('Открытая корзина не найдена');
                    reject('Открытая корзина не найдена');
                    return;
                }

                const order_id = results[0].id;
                updateOrderItemQuantity(order_id, product_id, new_count);

                resolve('Количество товара в корзине успешно обновлено');
            });
        });
    });
}

function updateOrderItemCount(order_id, product_id, new_count) {
    const updateQuery = 'UPDATE order_items SET count = ? WHERE order_id = ? AND product_id = ?';

    connection.query(updateQuery, [new_count, order_id, product_id], (error) => {
        if (error) {
            console.error('Ошибка при обновлении количества товара в корзине:', error);
        }
    });
}

export function update_cart_status_to_in_progress(username) {
    return new Promise((resolve, reject) => {
        // Get the user's email based on the username
        const getUserEmailQuery = 'SELECT email FROM users WHERE username = ?';

        connection.query(getUserEmailQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении email пользователя:', error);
                reject(error);
                return;
            }

            if (results.length === 0) {
                console.error('Пользователь не найден');
                reject('Пользователь не найден');
                return;
            }

            const user_email = results[0].email;

            // Get the open cart for the user
            const getOpenCartQuery = 'SELECT * FROM orders WHERE user_email = ? AND status = "in_cart"';

            connection.query(getOpenCartQuery, [user_email], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении открытой корзины:', error);
                    reject(error);
                    return;
                }

                if (results.length === 0) {
                    console.error('Открытая корзина не найдена');
                    reject('Открытая корзина не найдена');
                    return;
                }

                const order_id = results[0].id;
                updateOrderStatus(order_id, 'in_progress');

                resolve('Статус заказа успешно изменен на "в обработке"');
            });
        });
    });
}

function updateOrderStatus(order_id, new_status) {
    const updateQuery = 'UPDATE orders SET status = ? WHERE id = ?';

    connection.query(updateQuery, [new_status, order_id], (error) => {
        if (error) {
            console.error('Ошибка при обновлении статуса заказа:', error);
        }
    });
}

/*
get_order_by_id(1).then((order) => {
    console.log(order); // Log the retrieved order by ID
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_orders_by_user('test@test.test').then((orders) => {
    console.log(orders); // Log the retrieved orders by user email
}).catch((error) => {
    console.error(error); // Handle any errors
}); */
/*get_order_items_in_cart('test').then((results) => {
    console.log(results); // Log the retrieved orders in cart and associated products by username
}).catch((error) => {
    console.error(error); // Handle any errors
});*/
