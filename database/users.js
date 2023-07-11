import mysql from 'mysql'


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
            INSERT INTO users (email, username, password)
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
export function checkPassword(username, password) {
    return new Promise((resolve, reject) => {
        connection.connect((error) => {
            if (error) {
                console.error('Ошибка подключения к базе данных:', error);
                reject(error);
                return;
            }
            console.log('Подключено к базе данных MySQL2');

            // SQL-запрос для выборки пользователя по имени пользователя (username)
            const selectQuery = `
                SELECT * FROM users WHERE username = ?
            `;
            const values = [username];

            // Выполнение SQL-запроса для выборки пользователя
            connection.query(selectQuery, values, (error, results) => {

                if (error) {
                    console.error('Ошибка выборки данных:', error);
                    connection.end();
                    reject(error);
                    return;
                }

                // Проверка пароля
                if (results.length === 0) {
                    // Пользователь не найден
                    resolve(false);
                } else {
                    // Пользователь найден, сравниваем пароли
                    const user = results[0];

                    if (user.password === password) {
                        console.log('Пароль верный')
                        resolve(true); // Пароль совпадает

                    } else {
                        console.log('Пароль неверный')
                        resolve(false); // Пароль не совпадает

                    }
                }

                connection.end();
            });
        });
    });
}

