const EmailValidator = require("email-validator")
const MD5 = require("md5")
const UserModel = require("../models/users.model");
const { checkFields } = require("../helpers/validation.helpers");

class UserController{
    createUser = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let check_fields_result = await checkFields(["first_name", "last_name", "email_address", "password", "confirm_password"], req.body);
            
            if(check_fields_result.status){
                if(EmailValidator.validate(check_fields_result.result.email_address)){
                    let fetch_user_result = await UserModel.fetchuserByEmail(check_fields_result.result.email_address);

                    if(!fetch_user_result.status){
                        if(check_fields_result.result.password === check_fields_result.result.confirm_password){
                            delete check_fields_result.result.confirm_password;

                            let create_user_result = await UserModel.createUser({ ...check_fields_result.result, password: MD5(check_fields_result.result.password)});

                            if(create_user_result.status){
                                response_data.status = true;
                                req.session.user_data = create_user_result.result;
                                req.session.save();
                            }
                        }
                        else{
                            response_data.message = "Passwords must match.";
                        }
                    }
                    else{
                        response_data.message = "This email address is already registered.";
                    }
                }
                else{
                    response_data.message = "Please use valid email address.";
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

    loginUser = async(req, res) => {
        let response_data = { status: false, result: {}, error: null };
        
        try{
            let check_fields_result = await checkFields(["email_address", "password"], req.body);

            if(check_fields_result.status){
                let fetch_user_result = await UserModel.fetchuserByEmail(check_fields_result.result.email_address);

                if(fetch_user_result.status){
                    if(fetch_user_result.result.password === MD5(check_fields_result.result.password)){
                        response_data.status = true;

                        req.session.user_data = fetch_user_result.result;
                        req.session.save();
                    }
                    else{
                        response_data.message = "Incorrect password.";
                    }
                }
                else{
                    response_data.message = "Email not found in the database.";
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

module.exports = (function User(){
    return new UserController();
})();