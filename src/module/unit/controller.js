const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const unit = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};



class Controller{

    static async register(req,res){
        const{nama_unit,ps_id}=req.body

        try {
                const [row, created] = await unit.findOrCreate({
                where: {nama_unit},
                defaults: {unit_id:uuid_v4(),nama_unit,ps_id},
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
        const{unit_id,nama_unit,ps_id}= req.body
        let conditions = [];
        let replacements = {};
        if (unit_id) {
            conditions.push('p.unit_id != :unit_id');
            replacements.unit_id = unit_id;
        }
        if (nama_unit) {
            conditions.push('p.nama_unit = :nama_unit');
            replacements.nama_unit = nama_unit;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let cek_uniq= await sq.query(` select * from unit s where s."deletedAt" isnull  ${whereClause}`,{replacements: { ...replacements },s})
            if(cek_uniq.length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await unit.update({nama_unit,ps_id},{where:{
                    unit_id
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
        const{unit_id}=req.body
        let isi=``
        if(unit_id){
            isi += ` and f.unit_id = '${unit_id}' `
        }

        try {
            let data = await sq.query(`select * from unit f left join  ps as p on p.ps_id  = f.ps_id  where f."deletedAt" isnull ${isi} `,s)
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{unit_id}=req.body
        try {
            await unit.destroy({where:{unit_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller