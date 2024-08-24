const Controller = require('./controller');
const router = require('express').Router();
const authentification= require('../../middleware/authentification')
const upload = require('../../helper/upload')


router.post('/register',authentification,upload, Controller.register);
router.post('/login', Controller.login);
router.post('/update', authentification,upload,Controller.update);
router.post('/list',authentification, Controller.list);
router.post('/delete',authentification, Controller.delete);
router.post('/change_password',authentification, Controller.change_password);
router.post('/reset_password',authentification, Controller.reset_password);


module.exports = router