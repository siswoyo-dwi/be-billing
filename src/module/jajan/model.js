const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')

const jajan = sq.define('jajan',{
    jajan_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_jajan:{
        type:DataTypes.STRING
    },
    jenis_jajan:{
        type:DataTypes.STRING        //minuman ,snack
    },
    harga_beli:{
        type:DataTypes.INTEGER
    },
    harga_jual:{
        type:DataTypes.INTEGER
    }
    
},
{
paranoid:true,
freezeTableName:true
});



// users.sync({ alter: true })
module.exports = jajan