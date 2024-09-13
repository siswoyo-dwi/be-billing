const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const user=require('../users/model')
const paket=require('../paket/model')
const unit=require('../unit/model')

const pendapatan = sq.define('pendapatan',{
    pendapatan_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    paket_id:{
        type:DataTypes.STRING        
    },
    mulai:{
        type:DataTypes.DATE        
    },
    selesai:{
        type:DataTypes.DATE        
    },
    user_id:{
        type:DataTypes.STRING
    },
    unit_id:{
        type:DataTypes.STRING
    },
    harga_paket:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    status:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
},
{
paranoid:true,
freezeTableName:true
});

pendapatan.belongsTo(user,{foreignKey:"user_id"})
user.hasMany(pendapatan,{foreignKey:"user_id"})

pendapatan.belongsTo(paket,{foreignKey:"paket_id"})
paket.hasMany(pendapatan,{foreignKey:"paket_id"})

pendapatan.belongsTo(unit,{foreignKey:"unit_id"})
unit.hasMany(pendapatan,{foreignKey:"unit_id"})
// users.sync({ alter: true })
module.exports = pendapatan