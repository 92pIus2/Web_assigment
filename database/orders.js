import mysql from 'mysql'


const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7632054',
    password: 'QibQTRHnma',
    database: 'sql7632054'
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
