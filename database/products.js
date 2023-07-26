import mysql from 'mysql';
import {print_products} from "./test.js";

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

// id
// artist
// album
// price
// genre

export function add_product(artist, album, price, genre) {
    // Query to get the maximum existing id from the products table
    const getMaxIdQuery = 'SELECT MAX(id) AS max_id FROM products';

    connection.query(getMaxIdQuery, (error, results) => {
        if (error) {
            console.error('Error getting maximum id:', error);
            return;
        }

        // Get the maximum existing id from the query results
        const maxId = results[0].max_id;

        // Calculate the new id for the product (maximum existing id + 1)
        const newId = maxId + 1;

        // SQL query to insert the new product with the calculated id
        const insertQuery = `
            INSERT INTO products (id, artist, album, price, genre)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [newId, artist, album, price, genre];

        // Execute SQL query to insert the new product
        connection.query(insertQuery, values, (error) => {
            if (error) {
                console.error('Error inserting data:', error);
                return;
            }
            console.log('Data inserted successfully');
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

export function get_all_products() {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения всех товаров
        const selectQuery = 'SELECT * FROM products';

        // Выполнение SQL-запроса для получения всех товаров
        connection.query(selectQuery, (error, results) => {
            if (error) {
                console.error('Ошибка при получении всех товаров:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results);
        });
    });
}

export function update_images() {


        // SQL queries to update images for specific products
        const updateImagesQuery = `
            UPDATE products
            SET image = CASE
                WHEN artist = 'Morgenshtern' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Solid_black.svg/548px-Solid_black.svg.png'
                WHEN artist = 'Tyler, the Creator' THEN 'https://upload.wikimedia.org/wikipedia/ru/thumb/e/e4/Tyler%2C_the_Creator_-_Igor.jpg/548px-Tyler%2C_the_Creator_-_Igor.jpg'
                WHEN artist = 'Metallica' THEN 'https://upload.wikimedia.org/wikipedia/ru/thumb/c/c2/Metallica_Album.jpg/548px-Metallica_Album.jpg'
                WHEN artist = 'ABBA' THEN 'https://upload.wikimedia.org/wikipedia/en/6/61/ABBA_-_Voulez_Vous.jpg'
                WHEN artist = 'Kanye West' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Solid_black.svg/548px-Solid_black.svg.png'
                ELSE NULL
            END
        `;

        // Executing the SQL query to update images
        connection.query(updateImagesQuery, (error, results) => {
            if (error) {
                console.error('Error updating images:', error);
                return;
            }
            console.log('Images updated successfully.');
        });

}