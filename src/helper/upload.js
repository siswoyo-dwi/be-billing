var multer  = require('multer')


const storage = multer.diskStorage({
    destination:'./asset/file/',
    filename:function(req,file,cb){
        console.log(file);
        if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype ==='application/octet-stream' || file.mimetype ==='image/webp'){
            // console.log('zxczxc');
            if(req.body.is_mobile==true){
                cb(null,Date.now()+file.originalname+"."+mime.extension(file.mimetype))
            }
            else{
                cb(null,Date.now()+file.originalname)
            }
        }
        else{
            // console.log('qweqwe');
            req.filemasuk=true
            cb(null,'asd')
        }
      
       
         //console.log(file)
    }
})

const upload=multer({
    storage:storage
}).fields([{ name: 'file1'}, { name: 'file2'},{ name: 'file3'},{ name: 'file4'},{ name: 'file5'},{name:'file6'}])

module.exports = upload