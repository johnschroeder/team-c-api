/**
 * Created by requi_000 on 5/21/2015.
 */
var mysql = require("mysql");
var config = require("konfig")();

    exports.databaseName = "imp_db";

    /* To substitute into the query, if you want to add more tables, add them here and then insert them into query */
    exports.productTable = "Products";
    exports.runTable = "Runs";
    exports.batchTable = "Batches";

    /* If you edit any tabels, add the fields here and it will change it in the query */
    exports.prodFields = "(ProductID int AUTO_INCREMENT, Name varchar(255), Customer varchar(255), Description varchar(255), DateCreated date, PRIMARY KEY (ProductID))";
    exports.runFields = "(RunID int AUTO_INCREMENT, ProductID int, Date date, PRIMARY KEY (RunID), FOREIGN KEY (ProductID) REFERENCES Products(ProductID))";
    exports.batchFields ="(RunID int, Amount float, Location VARCHAR(100), Foreign Key (RunID) References Runs(RunID))";

    /* Connects to mySQL server */
    exports.connection = mysql.createConnection({
            host: config.app.mysql.host,
            user: config.app.mysql.user,
            password: config.app.mysql.password

    });


