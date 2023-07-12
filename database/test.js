import mysql from 'mysql'

const connection = mysql.createConnection({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7632054',
  password: 'QibQTRHnma',
  database: 'sql7632054'
});
function print_users() {
  connection.connect((error) => {
    if (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return;
    }
    console.log('Подключено к базе данных MySQL');
    //email
    //username
    //password


    // SQL-запрос для выборки данных
    const selectQuery = 'SELECT * FROM users';

    // Выполнение SQL-запроса для выборки данных
    connection.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Ошибка выборки данных:', error);
      } else {
        console.log('Результаты выборки:');
        console.log(results);
      }
      connection.end();
    });

  });
}

function print_products() {
  connection.connect((error) => {
    if (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return;
    }
    console.log('Подключено к базе данных MySQL');
    //id
    //artist
    //album
    //price
    //genre


    // SQL-запрос для выборки данных
    const selectQuery = 'SELECT * FROM products';

    // Выполнение SQL-запроса для выборки данных
    connection.query(selectQuery, (error, results) => {
      if (error) {
        console.error('Ошибка выборки данных:', error);
      } else {
        console.log('Результаты выборки:');
        console.log(results);
      }
      connection.end();
    });

  });
}