var mysql = require("mysql");

const DB_CONFIG = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
};

export const getDBConnection = () => {
  return mysql.createConnection(DB_CONFIG);
};

/**
 * This must be called before connection.query(...);
 */
export const connectToDB = (connection: any) => {
  connection.connect(function (err: any) {
    if (err) {
      throw err;
    }
  });
};

/**
 * This must be called after connection.query(...)
 */
export const endDBConnection = (connection: any) => {
  connection.end(function (err: any) {
    if (err) {
      throw err;
    }
  });
};

export const execQuery = (query: string, data: any, callBack: any) => {
  var connection = getDBConnection();
  connectToDB(connection);
  connection.query(query, data, function (err: any, res: any) {
    if (err) {
      callBack(err);
    }
    callBack(null, res);
  });
  endDBConnection(connection);
};
