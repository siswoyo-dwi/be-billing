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
        const{ps_id,paket_id,user_id,pendapatan}=req.body
        try {
            let data = await pendapatan.create({pendapatan_id:uuid_v4(),ps_id,paket_id,user_id,pendapatan})
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
        const{pendapatan_id,ps_id,paket_id,user_id,pendapatan}=req.body
        try {
        
               let asd =  await pendapatan.update({ps_id,paket_id,user_id,pendapatan},{where:{
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
    
    static async list(req,res){
        const{pendapatan_id,ps_id,paket_id,user_id,date,bulan,tahun,jumlah}=req.body
        let offset = (+halaman -1) * jumlah;
        let conditions = [];
        let replacements = {};
        if (pendapatan_id) {
            conditions.push('p.pendapatan_id = :pendapatan_id');
            replacements.pendapatan_id = pendapatan_id;
        }
        if (ps_id) {
            conditions.push('p.ps_id = :ps_id');
            replacements.ps_id = ps_id;
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
            where p."deletedAt" isnull ${whereClause} order by p."createdAt" desc LIMIT :jumlah OFFSET :offset `,{replacements: { ...replacements, jumlah, offset },s})
            let jml = await sq.query(` select count(*) from pendapatan p where p."deletedAt" isnull ${whereClause} `,{replacements: { ...replacements },s})
            res.status(200).json({status:200,message:"sukses",data,count:jml[0].count,jumlah,halaman});  

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
        const{bulan,tahun}=req.body
        try {
            let data = await sq.query(`select date(p."createdAt") ,count(*) from pendapatan p where p."deletedAt" isnull  and extract('month' from p."createdAt")=${bulan} and extract('years' from p."createdAt")=${tahun}  group by date(p."createdAt") `,s)

            res.status(200).json({status:200,message:"sukses",data});
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, message: "gagal", data: error });
        }
    }
}

module.exports=Controller