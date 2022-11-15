const Mysql = require("mysql");
const databaseConnection = require("../configs/database");

class MessageModel{
    fetchMessages = async() => {
        let response_data = { status: false, result: {}, message: null}

        try{
            let fetch_messages_query = Mysql.format(`
                SELECT 
                    messages.*,
                    CONCAT(users.first_name, " ", users.last_name) AS full_name,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                "comment_id", comments.id,
                                "full_name", CONCAT(comment_users.first_name, " ", comment_users.last_name),
                                "comment", comments.comment,
                                "user_id", comment_users.id,
                                "created_at", DATE_FORMAT(messages.created_at, "%M %D %Y")
                            )
                        )
                        FROM comments
                        INNER JOIN users AS comment_users ON comment_users.id = comments.user_id
                        WHERE comments.message_id = messages.id
                    ) AS comments,
                    DATE_FORMAT(messages.created_at, "%M %D %Y") AS created_at
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                ORDER BY messages.id DESC;
            `);

            let fetch_messages_result = await databaseConnection.executeQuery(fetch_messages_query);

            response_data.status = true;
            response_data.result = fetch_messages_result;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    create = async(params) => {
        let response_data = { status: false, result: {}, message: null}

        try{
            let insert_message_query = Mysql.format(`INSERT INTO messages SET ?, created_at = NOW()`, [params]);

            let insert_message_result = await databaseConnection.executeQuery(insert_message_query);

            if(insert_message_result.insertId){
                response_data.status = true;
                response_data.result.message_id = insert_message_query.insertId;
            }
            else{
                response_data.message = "Something went wrong in inserting new message";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    delete = async(params) => {
        let response_data = { status: false, result: {}, message: null}

        try{
            let fetch_message_query = Mysql.format(`SELECT * FROM messages WHERE user_id = ? AND id = ?`, [params.user_id, params.message_id]);

            let fetch_message_result = await databaseConnection.executeQuery(fetch_message_query);

            if(fetch_message_result){
                /* Delete messages comment */
                let delete_messages_comment_query = Mysql.format(`DELETE FROM comments WHERE message_id = ?`, [params.message_id]);
                await databaseConnection.executeQuery(delete_messages_comment_query);

                let delete_message_query = Mysql.format(`DELETE FROM messages WHERE id = ?`, [params.message_id]);

                let delete_message_result = await databaseConnection.executeQuery(delete_message_query);

                if(delete_message_result.affectedRows){
                    response_data.status = true;
                }
                else{
                    response_data.message = "Something went wrong in deleting a message."; 
                }
            }
            else{
                response_data.message = "You dont have access to delete this message.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function Message(){
    return new MessageModel();
})();