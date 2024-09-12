const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const ps=require('../ps/model')

const paket = sq.define('paket',{
    paket_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_paket:{
        type:DataTypes.STRING
    },
    ps_id:{
        type:DataTypes.STRING
    },
    time:{
        type:DataTypes.INTEGER
    },
    harga_paket:{
        type:DataTypes.INTEGER
    }
},
{
paranoid:true,
freezeTableName:true
});

paket.belongsTo(ps,{foreignKey:"ps_id"})
ps.hasMany(paket,{foreignKey:"ps_id"})

// users.sync({ alter: true })
module.exports = paket