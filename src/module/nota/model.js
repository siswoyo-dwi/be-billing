const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')

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
},
{
paranoid:true,
freezeTableName:true
});



// users.sync({ alter: true })
module.exports = nota