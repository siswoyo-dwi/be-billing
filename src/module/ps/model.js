const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
// const fakultas=require('../fakultas/model')

const ps = sq.define('ps',{
    id:{
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

// ps.belongsTo(fakultas,{foreignKey:"fakultas_id"})
// fakultas.hasMany(ps,{foreignKey:"fakultas_id"})

// users.sync({ alter: true })
module.exports = ps