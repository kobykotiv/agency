const router = require('express').Router();

router.route('/').get((req, res) => {
  res.json('get user');
});

router.route('/add').post((req, res) => {
  res.json('add user');
});

module.exports = router;