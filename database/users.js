const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7632054',
    password: 'QibQTRHnma',
    database: 'sql7632054'
});
export function add_user(email, username, password) {
    connection.connect((error) => {
        if (error) {
            console.error('Ошибка подключения к базе данных:', error);
            return;
        }
        console.log('Подключено к базе данных MySQL');
        //email
        //username
        //password

        // SQL-запрос для вставки данных
        const insertQuery = `
            INSERT INTO users (column1, column2, column3)
            VALUES (?, ?, ?)
        `;
        const values = [email, username, password];

        // Выполнение SQL-запроса для вставки данных
        connection.query(insertQuery, values, (error) => {
            if (error) {
                console.error('Ошибка вставки данных:', error);
                connection.end();
                return;
            }
            console.log('Данные вставлены успешно');


        });
    });
}
