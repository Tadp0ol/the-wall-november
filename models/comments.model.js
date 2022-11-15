const Mysql = require("mysql");
const databaseConnection = require("../configs/database");

class CommentModel{

    create = async(params) => {
        let response_data = { status: false, result: {}, message: null}

        try{
            let insert_comment_query = Mysql.format(`INSERT INTO comments SET ?, created_at = NOW()`, [params]);

            let insert_comment_result = await databaseConnection.executeQuery(insert_comment_query);

            if(insert_comment_result.insertId){
                response_data.status = true;
                response_data.result.comment_id = insert_comment_result.insertId;
            }
            else{
                response_data.message = "Something went wrong in inserting new comment";
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
            let fetch_comment_query = Mysql.format(`SELECT * FROM comments WHERE user_id = ? AND id = ?`, [params.user_id, params.comment_id]);

            let fetch_comment_result = await databaseConnection.executeQuery(fetch_comment_query);

            if(fetch_comment_result){
                let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE id = ?`, [params.comment_id]);

                let delete_comment_result = await databaseConnection.executeQuery(delete_comment_query);

                if(delete_comment_result.affectedRows){
                    response_data.status = true;
                }
                else{
                    response_data.message = "Something went wrong in deleting a comment."; 
                }
            }
            else{
                response_data.message = "You dont have access to delete this comment.";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function Comment(){
    return new CommentModel();
})();