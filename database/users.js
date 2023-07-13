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
export function add_user(email, username, password) {
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
            return;
        }
        console.log('Данные вставлены успешно');
    });
}
export function update_user_by_username(username, new_email, new_password) {

// Выполняем SQL-запрос для обновления данных
    const updateQuery = 'UPDATE users SET email = ?, password = ? WHERE username = ?';

    connection.query(updateQuery, [new_email, new_password, username], (error, results) => {
        if (error) {
            console.error('Ошибка при обновлении данных:', error);
            // Обработка ошибки
        } else {
            console.log('Данные успешно обновлены!');
            // Дополнительные действия при успешном обновлении данных
        }
    });
}

export function update_user_by_email(email, new_username, new_password) {

// Выполняем SQL-запрос для обновления данных
    const updateQuery = 'UPDATE users SET username = ?, password = ? WHERE email = ?';

    connection.query(updateQuery, [new_username, new_password, email], (error, results) => {
        if (error) {
            console.error('Ошибка при обновлении данных:', error);
            // Обработка ошибки
        } else {
            console.log('Данные успешно обновлены!');
            // Дополнительные действия при успешном обновлении данных
        }
    });
}

export function delete_user(identifier) {
    // Check if the identifier is an email or username
    const isEmail = identifier.includes('@');
    let deleteQuery, values;

    if (isEmail) {
        // Delete user by email
        deleteQuery = 'DELETE FROM users WHERE email = ?';
        values = [identifier];
    } else {
        // Delete user by username
        deleteQuery = 'DELETE FROM users WHERE username = ?';
        values = [identifier];
    }

    // Execute the delete query
    connection.query(deleteQuery, values, (error) => {
        if (error) {
            console.error('Ошибка при удалении пользователя:', error);
            return;
        }
        console.log('Пользователь успешно удален');
    });
}

export function checkPassword(username, password) {
    return new Promise((resolve, reject) => {
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
        });
    });
}

export function get_user_by_email(email) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения пользователя по email
        const selectQuery = 'SELECT * FROM users WHERE email = ?';

        // Выполнение SQL-запроса для получения пользователя
        connection.query(selectQuery, [email], (error, results) => {
            if (error) {
                console.error('Ошибка при получении пользователя:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results[0]);
        });
    });
}

export function get_user_by_username(username) {
    return new Promise((resolve, reject) => {
        // SQL-запрос для получения пользователя по username
        const selectQuery = 'SELECT * FROM users WHERE username = ?';

        // Выполнение SQL-запроса для получения пользователя
        connection.query(selectQuery, [username], (error, results) => {
            if (error) {
                console.error('Ошибка при получении пользователя:', error);
                reject(error);
                return;
            }

            // Возвращаем результаты
            resolve(results[0]);
        });
    });
}

/*
get_user_by_email('test@test.test').then((user) => {
    console.log(user); // Log the retrieved user by email
}).catch((error) => {
    console.error(error); // Handle any errors
});

get_user_by_username('admin').then((user) => {
    console.log(user); // Log the retrieved user by username
}).catch((error) => {
    console.error(error); // Handle any errors
});
*/
