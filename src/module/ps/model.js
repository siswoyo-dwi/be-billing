const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const ps = sq.define('ps',{
    ps_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_ps:{
        type:DataTypes.STRING
    }
    
},
{
paranoid:true,
createdAt: false,
updatedAt:false,
freezeTableName:true
});

// users.sync({ alter: true })
module.exports = ps