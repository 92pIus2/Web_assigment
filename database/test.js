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

function print_orders() {
  connection.connect((error) => {
    if (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return;
    }
    console.log('Подключено к базе данных MySQL');
    //id
    //status


    // SQL-запрос для выборки данных
    const selectQuery = 'SELECT * FROM orders';

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

function print_order_items() {
  connection.connect((error) => {
    if (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return;
    }
    console.log('Подключено к базе данных MySQL');



    // SQL-запрос для выборки данных
    const selectQuery = 'SELECT * FROM order_items';

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

print_products()

/*connection.connect((error) => {
  if (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return;
  }
  console.log('Подключено к базе данных MySQL');

  //id
  //order_id
  //product_id
  //count

  // SQL-запрос для создания таблицы
  const createTableQuery = `
    CREATE TABLE order_items (
      id INT,
      order_id INT,
      product_id INT,
      count INT,
      PRIMARY KEY (id)
    )
  `;

  // Выполнение SQL-запроса для создания таблицы
  connection.query(createTableQuery, (error) => {
    if (error) {
      console.error('Ошибка создания таблицы:', error);
      connection.end();
      return;
    }
    console.log('Таблица создана успешно');

    // SQL-запрос для вставки данных
    const insertQuery = `
      INSERT INTO order_items (id, order_id, product_id, count) VALUES (?, ?, ?, ?)
    `;
    const values = [1, 1, 1, 10];

    // Выполнение SQL-запроса для вставки данных
    connection.query(insertQuery, values, (error) => {
      if (error) {
        console.error('Ошибка вставки данных:', error);
        connection.end();
        return;
      }
      console.log('Данные вставлены успешно');

      // SQL-запрос для выборки данных
      const selectQuery = 'SELECT * FROM order_items';

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
  });
});*/



/*
// Выполняем SQL-запрос для добавления столбца

const alterTableQuery = 'ALTER TABLE orders ADD user_email VARCHAR(255)';
connection.query(alterTableQuery, (error, results) => {
  if (error) {
    console.error('Ошибка при добавлении столбца:', error);
    // Обработка ошибки
  } else {
    console.log('Столбец успешно добавлен!');
    // Дополнительные действия при успешном добавлении столбца
  }

  // Закрываем подключение к базе данных
  connection.end();
}); */
