const router = require("express").Router();

router.use('/users',require('./module/users/route'))
router.use('/ps',require('./module/ps/route'))
router.use('/jajan',require('./module/jajan/route'))
router.use('/paket',require('./module/paket/route'))
router.use('/pendapatan',require('./module/pendapatan/route'))
router.use('/pengeluaran',require('./module/pengeluaran/route'))
router.use('/unit',require('./module/unit/route'))

module.exports=router