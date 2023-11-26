const messages = require("../constants/Messages");
const {API_STATUS} = require('../constants/Common');

module.exports = {
    ballValidate: async function(req,res,next){
        let {name} = req.body;
        let errors = {};
        if(!name || !name.trim()){
            errors['name'] = messages.required;
        }else if(name.length > 100){
            errors['name'] = messages.max100chars;
        }
        if(Object.keys(errors).length){
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.UNPROCESSABLE_ENTITY,errors: errors});
        }
        return next();
    },
    bucketValidate: async function(req,res,next){
        let {name,capacity} = req.body;
        let errors = {};
        if(!name || !name.trim()){
            errors['name'] = messages.required;
        }else if(name.length > 100){
            errors['name'] = messages.max100chars;
        }
        if(!capacity){
            errors['capacity'] = messages.required;
        }
        if(Object.keys(errors).length){
            return res.status(API_STATUS.SUCCESS).send({status: API_STATUS.UNPROCESSABLE_ENTITY,errors: errors});
        }
        return next();
    }
}