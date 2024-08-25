const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const ps = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};



class Controller{

    static async register(req,res){
        const{nama_ps,ps_id}=req.body

        try {
                const [row, created] = await ps.findOrCreate({
                where: {nama_ps},
                defaults: {ps_id:uuid_v4(),nama_ps,},
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
        const{ps_id,nama_ps,}= req.body
        let conditions = [];
        let replacements = {};
        if (ps_id) {
            conditions.push('p.ps_id != :ps_id');
            replacements.ps_id = ps_id;
        }
        if (nama_ps) {
            conditions.push('p.nama_ps = :nama_ps');
            replacements.nama_ps = nama_ps;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let cek_uniq= await sq.query(` select * from ps p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            console.log(cek_uniq);
            
            if(cek_uniq[0].length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await ps.update({nama_ps,},{where:{
                    ps_id
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
        const{ps_id,nama_ps}=req.body
        let conditions = [];
        let replacements = {};
        if (ps_id) {
            conditions.push('p.ps_id = :ps_id');
            replacements.ps_id = ps_id;
        }
        if (nama_ps) {
            conditions.push('p.nama_ps = :nama_ps');
            replacements.nama_ps = nama_ps;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select p.* from ps p  where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{ps_id}=req.body
        try {
            await ps.destroy({where:{ps_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller