const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const user=require('../users/model')
const jajan=require('../jajan/model')
const nota=require('../nota/model')

const penjualan_jajan = sq.define('penjualan_jajan',{
    penjualan_jajan_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    jajan_id:{
        type:DataTypes.STRING        
    },
    jumlah_jajan:{
        type:DataTypes.INTEGER        
    },
    user_id:{
        type:DataTypes.STRING
    },
    nota_id:{
        type:DataTypes.STRING
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

penjualan_jajan.belongsTo(user,{foreignKey:"user_id"})
user.hasMany(penjualan_jajan,{foreignKey:"user_id"})

penjualan_jajan.belongsTo(jajan,{foreignKey:"jajan_id"})
jajan.hasMany(penjualan_jajan,{foreignKey:"jajan_id"})

penjualan_jajan.belongsTo(nota,{foreignKey:"nota_id"})
nota.hasMany(penjualan_jajan,{foreignKey:"nota_id"})
// users.sync({ alter: true })
module.exports = penjualan_jajan