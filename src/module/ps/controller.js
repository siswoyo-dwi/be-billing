const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const prodi = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};



class Controller{

    static async register(req,res){
        const{nama_prodi,fakultas_id}=req.body

        try {
                const [row, created] = await prodi.findOrCreate({
                where: {nama_prodi},
                defaults: {id:uuid_v4(),nama_prodi,fakultas_id},
              });
            
             if(created){
                res.status(200).json({status:200,message:"sukses",data:row});
            }
            else{
                res.status(200).json({status:201,message:"data sudah ada"});
            }
        } catch (error) {
            
        }

    }

    static  async update(req,res){
        const{id,nama_prodi,fakultas_id}= req.body
        try {
            let cek_uniq= await sq.query(` select * from prodi s where s."deletedAt" isnull and s.nama_prodi = '${nama_prodi}' and s.id !='${id}' `,s)
            if(cek_uniq.length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await prodi.update({nama_prodi,fakultas_id},{where:{
                    id
                }})
                if(asd>0){
                    res.status(200).json({status:200,message:"sukses"});
                }
                else{
                    res.status(200).json({status:204,message:"id tidak ada"});
                }

                
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
     
    }
    
    static async list(req,res){
        const{id,fakultas_id}=req.body
        let isi=``
        if(id){
            isi += ` and p.id = '${id}' `
        }
        if(fakultas_id){
            isi +=` and p.fakultas_id='${fakultas_id}' `
        }

        try {
            let data = await sq.query(`select p.*,f.nama_fakultas from prodi p join fakultas f on p.fakultas_id = f.id where p."deletedAt" isnull ${isi} `,s)
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{id}=req.body
        try {
            await prodi.destroy({where:{id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller