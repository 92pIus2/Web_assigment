import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({

    connectionString: "postgres://default:NuFfPp95MOcw@ep-fancy-art-548814-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require",

})

// Rest of your code using the 'pool' to interact with the PostgreSQL database



export function add_product(id, artist, album, price, genre) {
    const insertQuery = `
        INSERT INTO products (id, artist, album, price, genre)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [id, artist, album, price, genre];

    pool.query(insertQuery, values, (error) => {
        if (error) {
            console.error('Ошибка вставки данных:', error);
            return;
        }
        console.log('Данные вставлены успешно');
    });
}

export function update_product(id, new_artist, new_album, new_price, new_genre) {
    const updateQuery = `
        UPDATE products 
        SET artist = $1, album = $2, price = $3, genre = $4 
        WHERE id = $5
    `;

    const values = [new_artist, new_album, new_price, new_genre, id];

    pool.query(updateQuery, values, (error, results) => {
        if (error) {
            console.error('Ошибка при обновлении данных:', error);
        } else {
            console.log('Данные успешно обновлены!');
        }
    });
}

export function delete_product(id) {
    const deleteQuery = 'DELETE FROM products WHERE id = $1';

    pool.query(deleteQuery, [id], (error, results) => {
        if (error) {
            console.error('Ошибка при удалении товара:', error);
            return;
        }
        console.log('Товар успешно удален');
    });
}

export function get_product_by_id(id) {
    return new Promise((resolve, reject) => {
        const selectQuery = 'SELECT * FROM products WHERE id = $1';

        pool.query(selectQuery, [id], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товара:', error);
                reject(error);
                return;
            }

            resolve(results.rows[0]);
        });
    });
}

export function get_products_by_artist(artist) {
    return new Promise((resolve, reject) => {
        const selectQuery = 'SELECT * FROM products WHERE artist = $1';

        pool.query(selectQuery, [artist], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товаров:', error);
                reject(error);
                return;
            }

            resolve(results.rows);
        });
    });
}

export function get_products_by_genre(genre) {
    return new Promise((resolve, reject) => {
        const selectQuery = 'SELECT * FROM products WHERE genre = $1';

        pool.query(selectQuery, [genre], (error, results) => {
            if (error) {
                console.error('Ошибка при получении товаров:', error);
                reject(error);
                return;
            }

            resolve(results.rows);
        });
    });
}

export function create_table() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            artist VARCHAR(255) NOT NULL,
            album VARCHAR(255) NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            genre VARCHAR(100) NOT NULL
        )
    `;

    const insertProductsQuery = `
        INSERT INTO products (artist, album, price, genre)
        VALUES
            ('Artist 1', 'Album 1', 10, 'Hip-Hop'),
            ('Artist 2', 'Album 2', 20, 'Hip-Hop')
    `;

    pool.query(createTableQuery, (error) => {
        if (error) {
            console.error('Ошибка при создании таблицы:', error);
            return;
        }

        console.log('Таблица успешно создана');

        pool.query(insertProductsQuery, (error) => {
            if (error) {
                console.error('Ошибка при добавлении продуктов:', error);
                return;
            }
            console.log('Продукты успешно добавлены');
        });
    });
}
export function get_all_products() {
    return new Promise((resolve, reject) => {
        const selectQuery = 'SELECT * FROM products';

        pool.query(selectQuery, (error, results) => {
            if (error) {
                console.error('Ошибка при получении всех товаров:', error);
                reject(error);
                return;
            }

            resolve(results.rows);
        });
    });
}
async function main() {
    try {
        // Создаем таблицу и добавляем продукты (если они еще не созданы)

        // Получаем продукты по жанру
        const productsByGenre = await get_products_by_genre('Hip-Hop');
        console.log('Продукты по жанру:', productsByGenre);


    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}


