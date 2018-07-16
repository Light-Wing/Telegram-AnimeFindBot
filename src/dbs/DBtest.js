var mysql = require("mysql");

require('dotenv').config()

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
});
// connection.connect((err) => {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('Connected as id ' + connection.threadId);
//     connection.end()
// });


// connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// connection.end();


clientConnected(con);

function clientConnected(con) {
    tableHasData(con);
}

function tableHasData(con) {
    // connection.query(
    //     'SELECT * FROM employees LIMIT 0,10',
    //     function selectCb(err, results, fields) {
    //         if (err) {
    //             console.log("ERROR: " + err.message);
    //             throw err;
    //         }
    //         console.log("Got " + results.length + " Rows:");
    //         for (var i in results) {

    //             // console.log(results[i].[column name]);
    //             console.log('\ntest');

    //             console.log("The meta data about the columns:");
    //             console.log(fields);
    //         }
    //         connection.end();
    //     });

    // userPrefs
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var create_table = "CREATE TABLE IF NOT EXISTS userPrefs (name VARCHAR(255), address VARCHAR(255))";
        var insert_into = "INSERT INTO userPrefs (name, address) VALUES ('Company Ic', 'Highway 47')";
        var alter_table = "ALTER TABLE userPrefs ADD COLUMN id INT ? PRIMARY KEY"; // AUTO_INCREMENT

        con.query('CREATE TABLE IF NOT EXISTS users(' +
            'id INT NOT NULL,' +
            'PRIMARY KEY(id),' +
            'name VARCHAR(30)' +
            ')',
            function(err, result) {
                if (err) throw err;
                console.log('result', result);
            }
        );

        let check = `SELECT * FROM userPrefs WHERE id = 220643806`
        con.query(check, function(err, result) {
            if (err) throw err;
            console.log('result2', result);
            console.log("alter_table");
        });

        // con.query(create_table, function(err, result) {
        //     if (err != null && err.errno == 1050) {
        //         console.log(result);
        //         console.log("ER_TABLE_EXISTS_ERROR");
        //     } else if (err == null) {
        //         console.log('result', result);
        //         console.log("table created");
        //     } else throw err;
        // });
        // // con.query(alter_table, [msg.from.id], function(err, result) {
        // //     if (err) throw err;
        // //     console.log("alter_table");
        // // });
        // con.query(insert_into, function(err, result) {
        //     if (err) throw err;
        //     console.log("1 record inserted");
        // });
        // con.query("SELECT * FROM userPrefs", function(err, result, fields) {
        //     if (err) throw err;
        //     //Return the fields object:
        //     console.log(fields);
        // });
    })
};

//220643806
// var sql = "INSERT INTO customers (userID, username, langPref) VALUES ?";
// var values = [
//     [msg.from.id, msg.from.username, lang.pref],
//     ['Peter', 'Lowstreet 4'],
//     ['Amy', 'Apple st 652'],
// ];
// con.query(sql, [values], function (err, result) {
//     if (err) throw err;
//     console.log("Number of records inserted: " + result.affectedRows);
//   });

// {
//     fieldCount: 0,
//     affectedRows: 14,
//     insertId: 0,
//     serverStatus: 2,
//     warningCount: 0,
//     message: '\'Records:14  Duplicated: 0  Warnings: 0',
//     protocol41: true,
//     changedRows: 0
// }

// var name = 'Amy';
// var adr = 'Mountain 21';
// var sql = 'SELECT * FROM customers WHERE name = ? OR address = ?';
// con.query(sql, [name, adr], function (err, result) {
//   if (err) throw err;
//   console.log(result);
// });

//  var sql = "DELETE FROM customers WHERE address = 'Mountain 21'";

//  var sql = "DROP TABLE customers";

//  var sql = "DROP TABLE IF EXISTS customers";

//  var sql = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
//  var sql = "SELECT * FROM customers LIMIT 5";
//  var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
//  var sql = "SELECT * FROM customers LIMIT 2, 5";