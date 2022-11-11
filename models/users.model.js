const Mysql = require("mysql");
const databaseConnection = require("../configs/database");

class UserModel{

    createUser = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_user_query = Mysql.format(`INSERT INTO users SET ?, created_at = NOW();`, [params]);
            let create_user_result = await databaseConnection.executeQuery(create_user_query);

            if(create_user_result.insertId){
                response_data.status = true;
                response_data.result = { ...params, id: create_user_result.insertId };
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    fetchuserByEmail = async(email_address) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_user_query = Mysql.format(`SELECT id, email_address, first_name, last_name, password FROM users WHERE email_address = ?;`, [email_address]);
            let [fetch_user_result] = await databaseConnection.executeQuery(fetch_user_query);

            if(fetch_user_result){
                response_data.status = true;
                response_data.result = fetch_user_result;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function User(){
    return new UserModel();
})();