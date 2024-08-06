const Joi=require("joi");
module.exports.listingSchema=Joi.object({
    listing:Joi.object({                       //listing because it is obj name
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().min(0),
    }).required(),
})


//IT EXPORTS 
//IT SAYS listing should be compulsory object and then it's parameter as specified

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
       rating:Joi.number().required().min(1).max(5),
       comment:Joi.string().required()
    }).required(),
})



