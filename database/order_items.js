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
