const { DataTypes } = require('sequelize');
const {sq} =  require('../../config/connection')

const users = sq.define('users',{
    id:{
        type: DataTypes.STRING,
        primaryKey: true
    },
    username:{
         type:DataTypes.STRING,
         defaultValue:''
    },
    password:{
        type:DataTypes.STRING,
        defaultValue:''
    },
    role:{
        type:DataTypes.STRING,
        defaultValue:""
    },
    nama:{
        type:DataTypes.STRING,
        defaultValue:""
    },
    nip:{
        type:DataTypes.STRING
    },
    email_user:{
        type:DataTypes.STRING
    },
    foto_user:{
        type:DataTypes.STRING  //file1
    }
    
},
{
paranoid:true
});



// users.sync({ alter: true })
module.exports = users