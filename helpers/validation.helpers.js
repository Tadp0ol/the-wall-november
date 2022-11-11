const Helper = {};

Helper.checkFields = async(required_fields, req_body) => {
    let response_data = { status: false, result: {}, error: null };

    try{
        let missing_fields = [];
        let sanitized_data = {}

        for(let index in required_fields){
            let selected_key = required_fields[index];

            if(req_body[selected_key] && req_body[selected_key] !== ""){
                sanitized_data[selected_key] = req_body[selected_key];
            }
            else{
                missing_fields.push(selected_key);
            }
        }

        response_data.status = (missing_fields.length) ? false : true;
        response_data.result = (response_data.status) ? sanitized_data : missing_fields;
    }
    catch(error){
        response_data.error = error;
    }

    return response_data;
};

module.exports = Helper;
