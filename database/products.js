import mysql from 'mysql'
import {delete_order} from "./orders.js";


const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7632054',
    password: 'QibQTRHnma',
    database: 'sql7632054'
});
export function add_product(id, artist, album, price, genre){
    connection.connect((error) => {
        if (error) {
            console.error('Ошибка подключения к базе данных:', error);
            return;
        }
        console.log('Подключено к базе данных MySQL');


        // SQL-запрос для вставки данных
        const insertQuery = `
      INSERT INTO products (id, artist, album, price, genre)
      VALUES (?, ?, ?, ?, ?)
    `;
        const values = [id, artist, album, price, genre];

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

export function update_product(id, new_artist, new_album, new_price, new_genre) {

// Выполняем SQL-запрос для обновления данных
    const updateQuery = 'UPDATE products SET artist = ?, album = ?, price = ?, genre = ? WHERE id = ?';

    connection.query(updateQuery, [new_artist, new_album, new_price, new_genre, id], (error, results) => {
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

export function delete_product(id) {
    connection.connect((error) => {
        if (error) {
            console.error('Ошибка подключения к базе данных:', error);
            return;
        }
        console.log('Подключено к базе данных MySQL');

        // SQL-запрос для удаления данных
        const deleteQuery = 'DELETE FROM products WHERE id = ?';

        // Выполнение SQL-запроса для удаления данных
        connection.query(deleteQuery, [id], (error, results) => {
            if (error) {
                console.error('Ошибка при удалении товара:', error);
                connection.end();
                return;
            }
            console.log('Товар успешно удален');

            connection.end();
        });
    });
}
