const request = require('request');



async function captcha(req,res,next){
    
    const secretKey=process.env.SECRET_KEY
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
    if(!req.body.captcha){
        console.log("err");
        // return res.json({"success":false, "msg":"Capctha is not checked"});
        return  res.status(500).json({ status: 500, message: "Capctha is not checked" });
       
    }
    request(verifyUrl,(err,response,body)=>{
        console.log(body);

        if(err){console.log(err); }

        body = JSON.parse(body);

        if(!body.success || body.success === undefined){
            // return res.json({"success":false, "msg":"captcha verification failed"});
            return  res.status(500).json({ status: 500, message: "captcha verification failed" });
        }
        else if(body.score < 0.5){
            // return res.json({"success":false, "msg":"you might be a bot, sorry!", "score": body.score});
            return  res.status(500).json({ status: 500, message: "you might be a bot, sorry!", data: body.score });
        }
            // return res.json({"success":true, "msg":"captcha verification passed", "score": body.score});
            next()

    })



}



module.exports=captcha