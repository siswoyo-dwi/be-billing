const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const ps=require('../ps/model')

const unit = sq.define('unit',{
    unit_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    nama_unit:{
        type:DataTypes.STRING
    },
    ps_id:{
        type:DataTypes.STRING
    },
},
{
paranoid:true,
freezeTableName:true
});

unit.belongsTo(ps,{foreignKey:"ps_id"})
ps.hasMany(unit,{foreignKey:"ps_id"})

// users.sync({ alter: true })
module.exports = unit