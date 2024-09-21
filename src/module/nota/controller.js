const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const nota = require("./model");


class Controller{

    static async register(req,res){
        const{no_nota,atas_nama}=req.body

        try {
                const [row, created] = await nota.findOrCreate({
                where: {no_nota,atas_nama},
                defaults: {nota_id:uuid_v4(),no_nota,atas_nama},
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
        const{nota_id,no_nota,atas_nama}= req.body
        let conditions = [];
        let replacements = {};
        if (nota_id) {
            conditions.push('p.nota_id != :nota_id');
            replacements.nota_id = nota_id;
        }
        if (no_nota) {
            conditions.push('p.no_nota = :no_nota');
            replacements.no_nota = no_nota;
        }
        if (atas_nama) {
            conditions.push('p.atas_nama = :atas_nama');
            replacements.atas_nama = atas_nama;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let cek_uniq= await sq.query(` select * from nota p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            if(cek_uniq[0].length){
                res.status(200).json({status:201,message:"data sudah ada"});
            }
            else{
               let asd =  await nota.update({no_nota,atas_nama},{where:{
                nota_id
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
        const{nota_id,no_nota,atas_nama,jumlah,halaman}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if (nota_id) {
            conditions.push('p.nota_id = :nota_id');
            replacements.nota_id = nota_id;
        }
        if (no_nota) {
            conditions.push('p.no_nota = :no_nota');
            replacements.no_nota = no_nota;
        }
        if (atas_nama) {
            conditions.push('p.atas_nama = :atas_nama');
            replacements.atas_nama = atas_nama;
        }
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select * from nota p where p."deletedAt" isnull ${whereClause}  order by p."createdAt" desc `,{replacements: { ...replacements   },s})
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async delete(req,res){
        const{nota_id}=req.body
        try {
            await nota.destroy({where:{nota_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async sum_pendapatan_harian(req,res){
        const{date}=req.body
        try {
            let data = await sq.query(`select sum(total) as total_keseluruhan from nota n left join 
(select j.harga_jual*pj.jumlah_jajan as total , pj.nota_id from penjualan_jajan pj   left join jajan j on j.jajan_id = pj.jajan_id where pj."deletedAt" is null)
as a on n.nota_id =a.nota_id where n."createdAt" BETWEEN '${date} 00:00:00' AND '${date} 23:59:59'`,s)

            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
}

module.exports=Controller