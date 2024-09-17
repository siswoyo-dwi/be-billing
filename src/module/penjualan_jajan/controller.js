const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const penjualan_jajan = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const nodemailer = require("nodemailer");
const moment = require("moment/moment");
moment.locale('id');





class Controller{
    static async register(req,res){
        console.log(req.body,"ini body");
        const{jajan_id,nota_id,jumlah_jajan,status,user_id}=req.body
        try {
            let data = await penjualan_jajan.create({penjualan_jajan_id:uuid_v4(),jajan_id,nota_id,jumlah_jajan,status,user_id})
            res.status(200).json({status:200,message:"sukses",data});

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }


    }
    static async details_by_penjualan_jajan_id(req,res){
        const{penjualan_jajan_id}=req.params
        penjualan_jajan.findAll({where:{penjualan_jajan_id}})
        .then(data=>{
            res.status(200).json({status:200,message:"sukses",data});
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        })
    }

    static  async update(req,res){
        const{penjualan_jajan_id,jajan_id,nota_id,jumlah_jajan,status,user_id}=req.body
        let conditions = []
        let replacements ={}
        try {
            if (user_id) {
                conditions.push('s.user_id = :user_id');
                replacements.user_id = user_id;
            }
            if (penjualan_jajan_id) {
                conditions.push('s.penjualan_jajan_id = :penjualan_jajan_id');
                replacements.penjualan_jajan_id = penjualan_jajan_id;
            }
            if (jajan_id) {
                conditions.push('s.jajan_id = :jajan_id');
                replacements.jajan_id = jajan_id;
            }
            if (nota_id) {
                conditions.push('s.nota_id = :nota_id');
                replacements.nota_id = nota_id;
            }
            if (status) {
                conditions.push('s.status = :status');
                replacements.status = status;
            }
            const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';
            let cek_uniq= await sq.query(` select * from penjualan_jajan s where s."deletedAt" isnull and status = 1 ${whereClause}`,{replacements: { ...replacements }})
            if(cek_uniq[0].length){
                res.status(200).json({status:201,message:"Masih Digunakan"});
            }
            else{
               let asd =  await penjualan_jajan.update({jajan_id,nota_id,jumlah_jajan,status,user_id},{where:{
                    penjualan_jajan_id
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
    
    static  async update_status(req,res){
        const{penjualan_jajan_id,status}=req.body
        try {
               let asd =  await penjualan_jajan.update({status},{where:{
                    penjualan_jajan_id
                }})
                if(asd>0){
                    res.status(200).json({status:200,message:"sukses"});
                }
                else{
                    res.status(200).json({status:204,message:"id tidak ada"});
                }       
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
     
    }
    static playSound() {
        const audio = new Audio(require('@/assets/notif.mp3'));
        audio.play();
      }
    static async list(req,res){
        const{penjualan_jajan_id,jajan_id,nota_id,jumlah_jajan,status,user_id,jumlah,halaman}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if (penjualan_jajan_id) {
            conditions.push('p.penjualan_jajan_id = :penjualan_jajan_id');
            replacements.penjualan_jajan_id = penjualan_jajan_id;
        }
        if (jajan_id) {
            conditions.push('p.jajan_id = :jajan_id');
            replacements.jajan_id = jajan_id;
        }
        if (status) {
            conditions.push('p.status = :status');
            replacements.status = status;
        }
        if (nota_id) {
            conditions.push('p.nota_id = :nota_id');
            replacements.nota_id = nota_id;
        }
        if (user_id) {
            conditions.push('p.user_id = :user_id');
            replacements.user_id = user_id;
        }
        if (date) {
            conditions.push('p.createdAt = :date');
            replacements.date = date;
        }
        if (bulan) {
            conditions.push(' EXTRACT(MONTH FROM p.createdAt) = :bulan');
            replacements.bulan = bulan;
        }
        if (tahun) {
            conditions.push(' EXTRACT(YEAR FROM p.createdAt)  = :tahun');
            replacements.tahun = tahun;
        } 
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select p.id as penjualan_jajan_id,p."createdAt" as tanggal_penjualan_jajan,*  from penjualan_jajan p 
            left join ps p2 on p2.ps_id = p.ps_id 
            left join paket p3 on p3.paket_id = p.paket_id 
            left join user u on u.user_id = p.user_id 
            where p."deletedAt" isnull ${whereClause} order by p."createdAt" desc LIMIT  `,{replacements: { ...replacements  },s})
            let jml = await sq.query(` select count(*) from penjualan_jajan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count,jumlah,halaman});  

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async list_billing(req,res){
        const{penjualan_jajan_id,unit_id,paket_id,status,user_id,date,bulan,tahun}=req.body
        let conditions = [];
        let replacements = {};
        if (penjualan_jajan_id) {
            conditions.push('p.penjualan_jajan_id = :penjualan_jajan_id');
            replacements.penjualan_jajan_id = penjualan_jajan_id;
        }
        if (unit_id) {
            conditions.push('p.unit_id = :unit_id');
            replacements.unit_id = unit_id;
        }
        if (status) {
            conditions.push('p.status = :status');
            replacements.status = status;
        }
        if (paket_id) {
            conditions.push('p.paket_id = :paket_id');
            replacements.paket_id = paket_id;
        }
        if (user_id) {
            conditions.push('p.user_id = :user_id');
            replacements.user_id = user_id;
        }
        if (date) {
            conditions.push('p.mulai = :date');
            replacements.date = date;
        }
        if (bulan) {
            conditions.push(' EXTRACT(MONTH FROM p.mulai) = :bulan');
            replacements.bulan = bulan;
        }
        if (tahun) {
            conditions.push(' EXTRACT(YEAR FROM p.mulai)  = :tahun');
            replacements.tahun = tahun;
        } 
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`select u.unit_id ,p.penjualan_jajan_id , u.nama_unit , u.ps_id ,p2.nama_ps , p3.nama_paket , p.harga_paket , p.mulai , p.selesai , p.status 
            from unit u 
            left join penjualan_jajan p on u.unit_id = p.unit_id and (p.status = 1 or  p.status = 2 ) and  p."deletedAt" isnull
            left join ps p2 on p2.ps_id=u.ps_id and p2."deletedAt" is null 
            left join paket p3 on p3.paket_id = p.paket_id and  p3."deletedAt" isnull
            where u."deletedAt" isnull ${whereClause} order by u."createdAt" desc   `,{replacements: { ...replacements  },s})
            let jml = await sq.query(` select count(*) from penjualan_jajan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count});  

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async delete(req,res){
        const{penjualan_jajan_id}=req.body
        try {
            await penjualan_jajan.destroy({where:{penjualan_jajan_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async sum_penjualan_jajan_harian(req,res){
        const{bulan,tahun}=req.body
        try {
            let data = await sq.query(`select date(p."createdAt") ,count(*) from penjualan_jajan p where p."deletedAt" isnull  and extract('month' from p."createdAt")=${bulan} and extract('years' from p."createdAt")=${tahun}  group by date(p."createdAt") `,s)

            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
}

module.exports=Controller