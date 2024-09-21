const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')
const user=require('../users/model')

const nota = sq.define('nota',{
    nota_id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    no_nota:{
        type:DataTypes.STRING
    },
    atas_nama:{
        type:DataTypes.STRING 
    },
    user_id:{
        type:DataTypes.STRING 
    },
},
{
paranoid:true,
freezeTableName:true
});

nota.belongsTo(user,{foreignKey:"user_id"})
user.hasMany(nota,{foreignKey:"user_id"})


// users.sync({ alter: true })
module.exports = nota