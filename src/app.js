const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const routing = require('./index')
require('dotenv').config({})


app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('asset/file/'));

app.use('/', routing);

app.use((req,res,next)=>{
	res.status(404).json({ status: '404', message: "gagal,tidak ada endpoint"});
  })

const port = process.env.APP_PORT
app.listen(port, () => {
	console.log(` telah tersambung pada port : ${port}`)
});