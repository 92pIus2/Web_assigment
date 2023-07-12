import mysql from 'mysql'


const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7632054',
    password: 'QibQTRHnma',
    database: 'sql7632054'
});
export function add_order(id){
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

export function update_order(id, new_status, new_total) {

// Выполняем SQL-запрос для обновления данных
    const updateQuery = 'UPDATE orders SET status = ?, total = ? WHERE id = ?';

    connection.query(updateQuery, [new_status, new_total, id], (error, results) => {
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
