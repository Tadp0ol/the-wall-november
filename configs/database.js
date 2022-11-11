const Mysql = require('mysql');
const Constants = require('./constants');

const connection = Mysql.createPool(Constants.DATABSE);

connection.executeQuery = async (query) => {	
    return new Promise((resolve, reject) => {
        connection.query(query, function (error, result){
            if(error){
                reject(error);
            }
            else{
                resolve(result);
            }
        });
    });		
}

module.exports = connection;