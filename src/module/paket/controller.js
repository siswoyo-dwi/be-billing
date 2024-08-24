const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const paket = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};



class Controller{

    static async register(req,res){
        const{nama_paket,harga_paket}=req.body

        try {
                const [row, created] = await paket.findOrCreate({
                where: {nama_paket},
                defaults: {id:uuid_v4(),nama_paket,harga_paket},
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
        const{paket_id,nama_paket,harga_paket}= req.body
        let conditions = [];
        let replacements = {};
        if (paket_id) {
            conditions.push('p.paket_id != :paket_id');
            replacements.paket_id = paket_id;
        }
        if (nama_paket) {
            conditions.push('p.nama_paket = :nama_paket');
            replacements.nama_paket = nama_paket;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let cek_uniq= await sq.query(` select * from paket s where s."deletedAt" isnull  ${whereClause}`,{replacements: { ...replacements },s})
            if(cek_uniq.length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await paket.update({nama_paket,harga_paket},{where:{
                    paket_id
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
        const{paket_id}=req.body
        let isi=``
        if(paket_id){
            isi += ` and f.paket_id = '${paket_id}' `
        }

        try {
            let data = await sq.query(`select * from paket f where f."deletedAt" isnull ${isi} `,s)
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{paket_id}=req.body
        try {
            await paket.destroy({where:{paket_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller