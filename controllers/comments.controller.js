const CommentsModel = require("../models/comments.model");
const { checkFields } = require("../helpers/validation.helpers");

class CommentController{
    create = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            if(req?.session?.user_data){
                let check_fields_result = await checkFields(["comment", "message_id"], req.body);

                if(check_fields_result){
                    response_data = await CommentsModel.create({
                        comment: check_fields_result.result.comment, 
                        message_id: check_fields_result.result.message_id, 
                        user_id: req.session.user_data.id
                    });
                }
                else{
                    response_data.message = check_fields_result.result;
                }
            }
            else{
                response_data.message = "You must login first";
            }
        }
        catch(error){
            response_data.error = error;
        }

        res.json(response_data);
    }

    delete = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            if(req?.session?.user_data){
                let check_fields_result = await checkFields(["comment_id"], req.body);

                if(check_fields_result){
                    response_data = await CommentsModel.delete({comment_id: check_fields_result.result.comment_id, user_id: req.session.user_data.id});
                }
                else{
                    response_data.message = check_fields_result.result;
                }
            }
            else{
                response_data.message = "You must login first";
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