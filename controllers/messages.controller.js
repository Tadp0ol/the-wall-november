const MessageModel = require("../models/messages.model");
const { checkFields } = require("../helpers/validation.helpers");

class MessageController{
    create = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            if(req?.session?.user_data){
                let check_fields_result = await checkFields(["message"], req.body);

                if(check_fields_result){
                    response_data = await MessageModel.create({message: check_fields_result.result.message, user_id: req.session.user_data.id});
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
                let check_fields_result = await checkFields(["message_id"], req.body);

                if(check_fields_result){
                    response_data = await MessageModel.delete({message_id: check_fields_result.result.message_id, user_id: req.session.user_data.id});
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

module.exports = (function Message(){
    return new MessageController();
})();