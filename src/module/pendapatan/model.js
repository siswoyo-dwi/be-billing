const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const user=require('../users/model')
const ps=require('../ps/model')
const paket=require('../paket/model')
// const biro=require('../biro/model')

const pendapatan = sq.define('pendapatan',{
    pendapatan_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    ps_id:{
        type:DataTypes.STRING
    },
    paket_id:{
        type:DataTypes.STRING        
    },
    user_id:{
        type:DataTypes.STRING
    },
    pendapatan:{
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

pendapatan.belongsTo(ps,{foreignKey:"ps_id"})
ps.hasMany(pendapatan,{foreignKey:"ps_id"})

pendapatan.belongsTo(paket,{foreignKey:"paket_id"})
paket.hasMany(pendapatan,{foreignKey:"paket_id"})

// users.sync({ alter: true })
module.exports = pendapatan