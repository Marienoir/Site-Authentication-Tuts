const express = require('express')
const router = express.Router()
 
router.get('/', (req, res) => {
    req.flash('message', 'Success!!');
    res.render('index')
})
router.get('/users/login', (req, res) => {
    res.render('login')
})
module.exports = router