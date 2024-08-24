const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')

const pengeluaran = sq.define('pengeluaran',{
    pengeluaran_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_pengeluaran:{
        type:DataTypes.STRING
    },
    pengeluaran:{
        type:DataTypes.INTEGER, 
        defaultValue:0
    },
},
{
paranoid:true,
createdAt: false,
updatedAt:false
});



// users.sync({ alter: true })
module.exports = pengeluaran