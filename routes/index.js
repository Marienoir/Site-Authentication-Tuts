const express = require('express')
const router = express.Router()

router.get('/',  (req, res) => {
    req.flash('message', 'Success!!');
    res.render('index')
})

router.get('/users/dashboard', (req, res) => {
    res.render('dashboard')
})
module.exports = router