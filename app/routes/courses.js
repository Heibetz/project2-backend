var express = require('express');
var router = express.Router();
const courses = require('../controllers/course.controller');

// CRUD for courses
router.get('/', courses.findAll);
router.get('/:id', courses.findOne);
router.post('/', courses.create);
router.put('/:id', courses.update);
router.delete('/:id', courses.delete);
router.delete('/', courses.deleteAll);

module.exports = router;
