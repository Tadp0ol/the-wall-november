const Mysql = require("mysql");
const databaseConnection = require("../configs/database");

class CommentsModel{
    insertComment = async(params) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let insert_comments_query = Mysql.format(`INSERT INTO comments SET ?, created_at = NOW()`, [params]);

            let insert_comments_result = await databaseConnection.executeQuery(insert_comments_query);

            if(insert_comments_result.insertId){
                response_data.status = true;
                response_data.result.message_id = insert_comments_result.insertId;
            }
            else{
                response_data.message = "Something went wrong. Error in inserting new comment.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    fetchCommentById = async(params) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let fetch_comment_query = Mysql.format(`
                SELECT 
                    id, IF(TIMESTAMPDIFF(MINUTE, comments.created_at, NOW()) <= 30, TRUE, FALSE) AS can_delete 
                FROM comments 
                WHERE id = ?
                AND user_id = ?
            `, [params.comment_id, params.user_id]);

            let [fetch_comment_result] = await databaseConnection.executeQuery(fetch_comment_query);

            response_data.status = true;
            response_data.result = fetch_comment_result;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deleteComments = async(where_statement, where_params) =>{
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let delete_comments_query = Mysql.format(`DELETE FROM comments WHERE ${where_statement}`, [where_params]);

            let delete_comments_result = await databaseConnection.executeQuery(delete_comments_query);

            if(delete_comments_result.affectedRows){
                response_data.status = true;
            }
            else{
                response_data.message = "Something went wrong. Error in deleting comment.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function Comments(){
    return new CommentsModel();
})();