import mysql from 'mysql'


const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7632054',
    password: 'QibQTRHnma',
    database: 'sql7632054'
});
//id
//order_id
//product_id
//count
export function add_order_item(id, order_id, product_id, count){
    connection.connect((error) => {
        if (error) {
            console.error('Ошибка подключения к базе данных:', error);
            return;
        }
        console.log('Подключено к базе данных MySQL');


        // SQL-запрос для вставки данных
        const insertQuery = `
      INSERT INTO order_items (id, order_id, product_id, count)
      VALUES (?, ?, ?, ?)
    `;
        const values = [id, order_id, product_id, count];

        // Выполнение SQL-запроса для вставки данных
        connection.query(insertQuery, values, (error) => {
            if (error) {
                console.error('Ошибка вставки данных:', error);
                connection.end();
                return;
            }
            console.log('Данные вставлены успешно');
            connection.end();
        });

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

        // Закрываем подключение к базе данных
        connection.end();
    });
}

export function delete_order_item(id) {
    connection.connect((error) => {
        if (error) {
            console.error('Ошибка подключения к базе данных:', error);
            return;
        }
        console.log('Подключено к базе данных MySQL');

        // SQL-запрос для удаления данных
        const deleteQuery = 'DELETE FROM order_items WHERE id = ?';

        // Выполнение SQL-запроса для удаления данных
        connection.query(deleteQuery, [id], (error, results) => {
            if (error) {
                console.error('Ошибка при удалении элемента заказа:', error);
                connection.end();
                return;
            }
            console.log('Элемент заказа успешно удален');

            connection.end();
        });
    });
}

export function get_order_item_by_id(id) {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                console.error('Ошибка подключения к базе данных:', error);
                reject(error);
                return;
            }
            console.log('Подключено к базе данных MySQL');

            // SQL-запрос для получения элемента заказа по ID
            const selectQuery = 'SELECT * FROM order_items WHERE id = ?';

            // Выполнение SQL-запроса для получения элемента заказа
            connection.query(selectQuery, [id], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении элемента заказа:', error);
                    connection.end();
                    reject(error);
                    return;
                }

                // Возвращаем результаты
                resolve(results[0]);

                connection.end();
            });
        });
    });
}

export function get_order_items_by_order_id(order_id) {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                console.error('Ошибка подключения к базе данных:', error);
                reject(error);
                return;
            }
            console.log('Подключено к базе данных MySQL');

            // SQL-запрос для получения элементов заказа по ID заказа
            const selectQuery = 'SELECT * FROM order_items WHERE order_id = ?';

            // Выполнение SQL-запроса для получения элементов заказа
            connection.query(selectQuery, [order_id], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении элементов заказа:', error);
                    connection.end();
                    reject(error);
                    return;
                }

                // Возвращаем результаты
                resolve(results);

                connection.end();
            });
        });
    });
}

export function get_order_by_product_id(product_id) {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                console.error('Ошибка подключения к базе данных:', error);
                reject(error);
                return;
            }
            console.log('Подключено к базе данных MySQL');

            // SQL-запрос для получения заказа по ID продукта
            const selectQuery = `
                SELECT orders.*
                FROM orders
                INNER JOIN order_items ON orders.id = order_items.order_id
                WHERE order_items.product_id = ?
            `;

            // Выполнение SQL-запроса для получения заказа
            connection.query(selectQuery, [product_id], (error, results) => {
                if (error) {
                    console.error('Ошибка при получении заказа:', error);
                    connection.end();
                    reject(error);
                    return;
                }

                // Возвращаем результаты
                resolve(results);

                connection.end();
            });
        });
    });
}
/*
get_order_item_by_id(1).then((orderItem) => {
    console.log(orderItem); // Log the retrieved order item by ID
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_order_items_by_order_id(1).then((orderItems) => {
    console.log(orderItems); // Log the retrieved order items by order ID
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_order_by_product_id(1).then((orders) => {
    console.log(orders); // Log the retrieved orders by product ID
}).catch((error) => {
    console.error(error); // Handle any errors
});*/
