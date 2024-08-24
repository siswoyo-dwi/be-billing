const moment= require('moment')

// function asd(second){

//     if(second>86400000){

//     }
//     else{
//         let x = moment.duration(second).minutes()
//         return x
//     }
 
// }

// console.log(asd(120000));

// var x = 4000000000
// var d = moment.duration(x, 'milliseconds');
// var days = Math.floor(d.asDays())
// let h = x-days*86400000
// var hours = Math.floor(moment.duration(h, 'milliseconds').asHours()) 
// let m = h-hours*3600000
// var mins = Math.floor(moment.duration(m, 'milliseconds').asMinutes())

// console.log(`hari : ${days} ,jam : ${hours} ,menit : ${mins}`);


// console.log(moment().format('YYYY'));


let barang = ['bodrex','paramex','oskadon','panadol','mixagrip']
de_opname:'a11',barangnya:[]},{kode_opname//workingdays 2
let stock_opname=[{ko:'a22',barangnya:[]}]

for (let i = 0; i < barang.length; i++) {
    let x = i%stock_opname.length
    stock_opname[x].barangnya.push(barang[i])
    
}
console.log(stock_opname);

