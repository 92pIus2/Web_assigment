import mysql from 'mysql'
import {delete_order} from "./orders.js";


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
//artist
//album
//price
//genre
export function add_product(id, artist, album, price, genre){
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
            return;
        }
        console.log('Данные вставлены успешно');
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
    });
}

export function delete_product(id) {
    // SQL-запрос для удаления данных
    const deleteQuery = 'DELETE FROM products WHERE id = ?';

    // Выполнение SQL-запроса для удаления данных
    connection.query(deleteQuery, [id], (error, results) => {
        if (error) {
            console.error('Ошибка при удалении товара:', error);
            return;
        }
        console.log('Товар успешно удален');
    });
}

export function get_product_by_id(id) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения товара по ID
        const selectQuery = 'SELECT * FROM products WHERE id = ?';

        // Выполнение SQL-запроса для получения товара
        connection.query(selectQuery, [id], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товара:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results[0]);
        });
    });
}

export function get_products_by_artist(artist) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения товаров по артисту
        const selectQuery = 'SELECT * FROM products WHERE artist = ?';

        // Выполнение SQL-запроса для получения товаров
        connection.query(selectQuery, [artist], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товаров:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results);
        });
    });
}

export function get_products_by_genre(genre) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения товаров по жанру
        const selectQuery = 'SELECT * FROM products WHERE genre = ?';

        // Выполнение SQL-запроса для получения товаров
        connection.query(selectQuery, [genre], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товаров:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results);
        });
    });
}
/*
get_product_by_id(1).then((product) => {
    console.log(product); // Log the retrieved product by ID
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_products_by_artist('Tyler, the Creator').then((products) => {
    console.log(products); // Log the retrieved products by artist
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_products_by_genre('Hip-Hop').then((products) => {
    console.log(products); // Log the retrieved products by genre
}).catch((error) => {
    console.error(error); // Handle any errors
});
*/