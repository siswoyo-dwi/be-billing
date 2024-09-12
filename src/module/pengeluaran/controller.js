const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pengeluaran = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};



class Controller{

    static async register(req,res){
        const{nama_pengeluaran}=req.body

        try {
                const [row, created] = await pengeluaran.findOrCreate({
                where: {nama_pengeluaran},
                defaults: {id:uuid_v4(),nama_pengeluaran},
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
        const{id,nama_pengeluaran}= req.body
        try {
            let cek_uniq= await sq.query(` select * from pengeluaran s where s."deletedAt" isnull and s.nama_pengeluaran = '${nama_pengeluaran}' and s.id !='${id}' `,s)
            if(cek_uniq.length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await pengeluaran.update({nama_pengeluaran},{where:{
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
        const{pengeluaran_id,halaman,jumlah}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if(pengeluaran_id){
            conditions.push('p.pengeluaran_id = :pengeluaran_id');
            replacements.pengeluaran_id = pengeluaran_id;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select * from pengeluaran f where p."deletedAt" isnull l ${whereClause} order by p."createdAt" desc  `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{pengeluaran_id}=req.body
        try {
            await pengeluaran.destroy({where:{pengeluaran_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

}

module.exports=Controller