const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')

const paket = sq.define('paket',{
    paket_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_paket:{
        type:DataTypes.STRING
    },
    harga_paket:{
        type:DataTypes.INTEGER
    }
},
{
paranoid:true,
freezeTableName:true
});



// users.sync({ alter: true })
module.exports = paket