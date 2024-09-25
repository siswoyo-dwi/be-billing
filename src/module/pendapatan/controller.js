const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pendapatan = require("./model");
const { QueryTypes,Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const nodemailer = require("nodemailer");
const moment = require("moment/moment");
moment.locale('id');





class Controller{
    static async register(req,res){
        console.log(req.body,"ini body");
        const{unit_id,paket_id,status,mulai,selesai,user_id,harga_paket}=req.body
        try {
            let data = await pendapatan.create({pendapatan_id:uuid_v4(),status,mulai,selesai,unit_id,paket_id,user_id,harga_paket})
            res.status(200).json({status:200,message:"sukses",data});

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }


    }
    static async details_by_pendapatan_id(req,res){
        const{pendapatan_id}=req.params
        pendapatan.findAll({where:{pendapatan_id}})
        .then(data=>{
            res.status(200).json({status:200,message:"sukses",data});
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        })
    }

    static  async update(req,res){
        const{pendapatan_id,unit_id,paket_id,status,mulai,selesai,user_id,harga_paket}=req.body
        let conditions = []
        let replacements ={}
        try {
            if (unit_id) {
                conditions.push('s.unit_id = :unit_id');
                replacements.unit_id = unit_id;
            }
            const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';
            let cek_uniq= await sq.query(` select * from pendapatan s where s."deletedAt" isnull and status = 1 ${whereClause}`,{replacements: { ...replacements }})
            if(cek_uniq[0].length){
                res.status(200).json({status:201,message:"Masih Digunakan"});
            }
            else{
                await pendapatan.update({status:3},{where:{
                    unit_id,status:2
                }})
               let asd =  await pendapatan.update({unit_id,paket_id,status,mulai,selesai,user_id,harga_paket},{where:{
                    pendapatan_id
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
        const{pendapatan_id,status,selesai,harga_paket}=req.body
        try {
               let asd =  await pendapatan.update({status,selesai,harga_paket},{where:{
                    pendapatan_id
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
        const{pendapatan_id,unit_id,paket_id,status,user_id,date,bulan,tahun,jumlah,halaman}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if (pendapatan_id) {
            conditions.push('p.pendapatan_id = :pendapatan_id');
            replacements.pendapatan_id = pendapatan_id;
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
            let data = await sq.query(`select p.id as pendapatan_id,p."createdAt" as tanggal_pendapatan,*  from pendapatan p 
            left join ps p2 on p2.ps_id = p.ps_id 
            left join paket p3 on p3.paket_id = p.paket_id 
            left join user u on u.user_id = p.user_id 
            where p."deletedAt" isnull ${whereClause} order by p."createdAt" desc LIMIT  `,{replacements: { ...replacements  },s})
            let jml = await sq.query(` select count(*) from pendapatan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count,jumlah,halaman});  

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async list_billing(req,res){
        const{pendapatan_id,unit_id,paket_id,status,user_id,date,bulan,tahun}=req.body
        let conditions = [];
        let replacements = {};
        if (pendapatan_id) {
            conditions.push('p.pendapatan_id = :pendapatan_id');
            replacements.pendapatan_id = pendapatan_id;
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
            conditions.push(` p.mulai BETWEEN '${date} 00:00:00' AND '${date} 23:59:59'  `);
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
            let data = await sq.query(`select u.unit_id ,p.pendapatan_id , u.nama_unit , u.ps_id ,p2.nama_ps , p3.nama_paket , p.harga_paket , p.mulai , p.selesai , p.status 
            from unit u 
            left join pendapatan p on u.unit_id = p.unit_id and (p.status = 1 or  p.status = 2 ) and  p."deletedAt" isnull
            left join ps p2 on p2.ps_id=u.ps_id and p2."deletedAt" is null 
            left join paket p3 on p3.paket_id = p.paket_id and  p3."deletedAt" isnull
            where u."deletedAt" isnull ${whereClause} order by u."createdAt" desc   `,{replacements: { ...replacements  },s})
            let jml = await sq.query(` select count(*) from pendapatan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count});  

        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async delete(req,res){
        const{pendapatan_id}=req.body
        try {
            await pendapatan.destroy({where:{pendapatan_id}})
            res.status(200).json({status:200,message:"sukses"});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }

    static async sum_pendapatan_harian(req,res){
        const{date}=req.body
        try {
            let data = await sq.query(`select sum(harga_paket) as total from pendapatan p where p."createdAt" BETWEEN '${date} 00:00:00' AND '${date} 23:59:59'`,s)

            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
    static async sum_pendapatan_bulanan(req,res){
        const{tahun}=req.body
        let conditions = [];
        let replacements = {};
        if (tahun) {
            conditions.push(' EXTRACT(YEAR FROM p.createdAt)  = :tahun');
            replacements.tahun = tahun;
        } 
        const whereClause = conditions.length > 0 ? `AND ${conditions.join(' AND ')}` : '';

        try {
            let data = await sq.query(`SELECT SUM(harga_paket) AS total_harga_paket, EXTRACT(MONTH FROM p."createdAt") AS bulan FROM pendapatan p  where p."deletedAt" isnull   ${whereClause}  GROUP BY bulan ORDER BY bulan;`,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
}

module.exports=Controller