const Mysql = require("mysql");
const databaseConnection = require("../configs/database");
const CommentsModel = require("../models/comments.model");

class MessagesModel{
    fetchMessages = async() =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let fetch_messages_query = Mysql.format(`
                SELECT 
                    messages.*,
                    CONCAT(users.first_name, " ", users.last_name) AS full_name,
                    (
                        SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    "comment_id", comments.id,
                                    "full_name", CONCAT(comment_users.first_name, " ", comment_users.last_name),
                                    "comment", comments.comment,
                                    "user_id", comments.user_id,
                                    "created_at", DATE_FORMAT(comments.created_at, "%M %D %Y")
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

    insertMessage = async(params) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let insert_messages_query = Mysql.format(`INSERT INTO messages SET ?, created_at = NOW()`, [params]);

            let insert_messages_result = await databaseConnection.executeQuery(insert_messages_query);

            if(insert_messages_result.insertId){
                response_data.status = true;
                response_data.result.message_id = insert_messages_result.insertId;
            }
            else{
                response_data.message = "Something went wrong. Error in inserting new message.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    fetchMessagesById = async(params) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let fetch_messages_query = Mysql.format(`
                SELECT 
                    messages.id, GROUP_CONCAT(comments.id) AS comment_ids,
                    IF(TIMESTAMPDIFF(MINUTE, messages.created_at, NOW()) <= 30, TRUE, FALSE) AS can_delete
                FROM messages
                LEFT JOIN comments ON comments.message_id = messages.id
                WHERE messages.id = ?
                AND messages.user_id = ?;
            `, [params.message_id, params.user_id]);

            let [fetch_messages_result] = await databaseConnection.executeQuery(fetch_messages_query);

            response_data.status = true;
            response_data.result = fetch_messages_result;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessage = async(params, has_comments) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            if(has_comments){
                let delete_comment_result = await CommentsModel.deleteComments("message_id = ?", [params.message_id]);

                if(!delete_comment_result.status){
                    return response_data;
                }
            }

            let delete_messages_query = Mysql.format(`DELETE FROM messages WHERE id = ?`, [params.message_id]);

            let delete_messages_result = await databaseConnection.executeQuery(delete_messages_query);

            if(delete_messages_result.affectedRows){
                response_data.status = true;
            }
            else{
                response_data.message = "Something went wrong. Error in deleting a message.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function Messages(){
    return new MessagesModel();
})();