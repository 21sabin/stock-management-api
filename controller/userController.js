const router = require('express').Router();

const userService = require('../services/userService');

router.get('/', (req, res) => {
  console.log('inside /GET users');
  userService.getAllUsers()
    .then(data => {
      res.status(200).json({
        message: "Users fetched successfully",
        success: true,
        data
      })
    })
    .catch(err => {
      res.json({
        message: "No users available",
        success: false,
        error: err
      })
    });
});



module.exports = router;