const { checkFields } = require("../helpers/validation.helpers");
const CommentsModel = require("../models/comments.model");

class CommentController{
    postComment = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields_result = await checkFields(["comment", "message_id"], req.body);
            
            if(check_fields_result.status){
                response_data = await CommentsModel.insertComment({ 
                    comment: check_fields_result.result.comment,
                    message_id: check_fields_result.result.message_id,
                    user_id: req.session.user_data.id 
                });
            }
            else{
                response_data.message = check_fields_result.result;
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    deleteComment = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields_result = await checkFields(["comment_id"], req.body);
            
            if(check_fields_result.status){
                let fetch_comment_result = await CommentsModel.fetchCommentById({
                    comment_id: check_fields_result.result.comment_id,
                    user_id: req.session.user_data.id 
                });

                if(fetch_comment_result){
                    if(fetch_comment_result.result.can_delete){
                        response_data = await CommentsModel.deleteComments("id = ?", [check_fields_result.result.comment_id]);
                    }
                    else{
                        response_data.message = "You cant delete comment that is posted 30 minutes ago.";
                    }
                }
                else{
                    response_data.message = "You dont have access to delete this comemnt.";
                }
            }
            else{
                response_data.message = check_fields_result.result;
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

}

module.exports = (function Comment(){
    return new CommentController();
})();