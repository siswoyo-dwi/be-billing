const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const users = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const bcrypt= require('../../helper/bcrypt')
const jwt= require('../../helper/jwt')

function createSuperUser() {
    let adminpass = bcrypt.hashPassword("admin")
    users.findOrCreate({

        where: {
            username: "admin"
        },
        defaults: {
            id:'admin',
            password: adminpass,
            role : "superuser"
        }
    })
}
createSuperUser()



class Controller{

    static async register(req, res){
        const {username,password,role,nama,nip,email_user}= req.body
        let encryptedPassword = bcrypt.hashPassword(password)

        if(req.filemasuk==true){
            return  res.status(500).json({ status: 500, message: "file bermasalah"});
        }

        let f1=""
        if(req.files){
            if(req.files.file1){
                f1=req.files.file1[0].filename
            }
        }

        try {
            const [row, created] = await users.findOrCreate({
                where: {username},
                defaults: {id:uuid_v4(),password:encryptedPassword,role,nama,nip,email_user,foto_user:f1}
              });
            
            if(created){
                res.status(200).json({status:200,message:"sukses",data:row});
            }
            else{
                res.status(200).json({status:201,message:"data sudah ada"});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
         
      }
      static login(req,res){
        const{username,password}= req.body
        users.findAll({
            where:{
                username:username
            }
        })
        .then(async data=>{
            // console.log(data[0].id);
            if(data.length){
        let hasil =  bcrypt.compare(password, data[0].dataValues.password);
                if(hasil){
                    res.json([{token : jwt.generateToken(data[0].dataValues),data:data[0]}])
                }
                else{
                    res.json({message : "password salah"})
                }
            }
            else{res.json({message :"username tidak terdaftar"})}
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        })
    }

    static async change_password(req,res){
        const{username,password_lama,password_baru}=req.body
        users.findAll({
            where:{
                username:username
            }
        })
        .then(async data=>{
            // console.log(data[0].id);
            if(data.length){
        let hasil =  bcrypt.compare(password_lama, data[0].dataValues.password);
                if(hasil){
                    await users.update({password:bcrypt.hashPassword(password_baru)},{where:{
                        username
                    }})
                    res.status(200).json({status:200,message:"sukses"});
                }
                else{
                    res.status(200).json({status:201,message:"password salah"});
                }
            }
            else{res.json({message :"username tidak terdaftar"})}
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }) 
      
    }

    static async reset_password(req,res){
        const{username}=req.body
        try {
            await users.update({password:bcrypt.hashPassword('ppidundip')},{where:{
                username
            }})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async list(req,res){
        const{role,users_id,halaman,jumlah,nip}= req.body

        try {
            let isi = ''
            let offset = (+halaman -1) * jumlah;

            if(role){
                isi+= ` and u.role = '${role}' `
            }
            if(users_id){
                isi+= ` and u.id = '${users_id}' `
            }
            if(nip){
                isi+= ` and u.nip = '${nip}' `
            }
            let data = await sq.query(`select * from users u where u."deletedAt" isnull and u.role <> 'superuser' ${isi}  order by u.id desc limit ${jumlah} offset ${offset}`,s)
            let jml = await sq.query(`select count(*) from users u where u."deletedAt" isnull and u.role <> 'superuser' ${isi} `,s)
        
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count,jumlah,halaman});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async update(req,res){
        const {id,username,password,role,nama,nip,email_user}= req.body
        if(req.filemasuk==true){
            return  res.status(500).json({ status: 500, message: "file bermasalah"});
        }
        if(req.files){
            if(req.files.file1){
                await users.update({foto_user:req.files.file1[0].filename},{where:{id}})
            }
        }
               await  users.update({username,password,role,nama,nip,email_user},{
                    where:{
                        id
                    } ,returning: true,
                    plain: true
                })
                .then(hasil1=>{
                        res.status(200).json({status:200,message:"sukses",data:hasil1[1]});
                    
                })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        })
        
    }

    static delete(req,res){
        const{id}=req.body

        users.destroy({where:{
            id
        }})
        .then(hasil=>{
            // console.log(hasil);
            if(hasil==0){
                res.status(200).json({status:201,message:"data tidak ada"});
            }
            else{
                res.status(200).json({status:200,message:"sukses"});
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal"})
        })

    }

    
}

module.exports=Controller