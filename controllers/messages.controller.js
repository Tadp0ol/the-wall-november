const { checkFields } = require("../helpers/validation.helpers");
const MessagesModel = require("../models/messages.model");

class MessageController{
    postMessage = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields_result = await checkFields(["message"], req.body);
            
            if(check_fields_result.status){
                response_data = await MessagesModel.insertMessage({ message: check_fields_result.result.message, user_id: req.session.user_data.id });
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

    deleteMessage = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields_result = await checkFields(["message_id"], req.body);
            
            if(check_fields_result.status){

                let fetch_message_result = await MessagesModel.fetchMessagesById({ message_id: check_fields_result.result.message_id, user_id: req.session.user_data.id });

                if(fetch_message_result.result){
                    if(fetch_message_result.result.can_delete){
                        response_data = await MessagesModel.deleteMessage({ message_id: check_fields_result.result.message_id, user_id: req.session.user_data.id }, fetch_message_result.result.comment_ids);
                    }
                    else{
                        response_data.message = "Tou cant delete message that is posted more than 30 minutes.";
                    }
                }
                else{
                    response_data.message = "You dont have access to delete this message";
                }
                // response_data = await MessagesModel.deleteMessage({ message_id: check_fields_result.result.message_id, user_id: req.session.user_data.id });
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

module.exports = (function Message(){
    return new MessageController();
})();