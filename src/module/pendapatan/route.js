const Controller = require('./controller');
const router = require('express').Router();
const authentification= require('../../middleware/authentification')
const upload=require('../../helper/upload')
const captcha= require('../../middleware/captcha')

router.post('/register', Controller.register);
router.post('/list_billing', Controller.list_billing);
router.post('/update', Controller.update);
router.post('/list', Controller.list);
router.post('/delete', Controller.delete);
router.get('/details_by_id/:pendapatan_id', Controller.details_by_pendapatan_id);
router.post('/update_status', Controller.update_status);


module.exports = router