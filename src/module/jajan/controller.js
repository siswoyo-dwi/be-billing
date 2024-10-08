const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const jajan = require("./model");


class Controller{

    static async register(req,res){
        const{nama_jajan,harga_jual,harga_beli}=req.body

        try {
                const [row, created] = await jajan.findOrCreate({
                where: {nama_jajan},
                defaults: {jajan_id:uuid_v4(),nama_jajan,harga_jual,harga_beli},
              });
            
             if(created){
                res.status(200).json({status:200,message:"sukses",data:row});
            }
            else{
                res.status(200).json({status:201,message:"data sudah ada"});
            }
        } catch (error) {
            console.log(error);
            
        }

    }

    static  async update(req,res){
        const{jajan_id,nama_jajan,harga_jual,harga_beli}= req.body
        let conditions = [];
        let replacements = {};
        if (jajan_id) {
            conditions.push('p.jajan_id != :jajan_id');
            replacements.jajan_id = jajan_id;
        }
        if (nama_jajan) {
            conditions.push('p.nama_jajan = :nama_jajan');
            replacements.nama_jajan = nama_jajan;
        }
  
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let cek_uniq= await sq.query(` select * from jajan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            if(cek_uniq[0].length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
                console.log(jajan_id,nama_jajan,harga_jual,harga_beli);
                
               let asd =  await jajan.update({nama_jajan,harga_jual,harga_beli},{where:{
                jajan_id
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
        const{jajan_id,nama_jajan,jumlah,halaman}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if (jajan_id) {
            conditions.push('p.jajan_id = :jajan_id');
            replacements.jajan_id = jajan_id;
        }
        if (nama_jajan) {
            conditions.push('p.nama_jajan = :nama_jajan');
            replacements.nama_jajan = nama_jajan;
        }

        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select * from jajan p where p."deletedAt" isnull ${whereClause}  order by p."createdAt" desc `,{replacements: { ...replacements   },s})
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{jajan_id}=req.body
        try {
            await jajan.destroy({where:{jajan_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller