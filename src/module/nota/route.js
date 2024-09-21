const Controller = require('./controller');
const router = require('express').Router();
const authentification= require('../../middleware/authentification')


router.post('/register', Controller.register);
router.post('/update',Controller.update);
router.post('/list', Controller.list);
router.post('/delete', Controller.delete);
router.post('/delete', Controller.delete);
router.post('/sum_pendapatan_harian', Controller.sum_pendapatan_harian);


module.exports = router