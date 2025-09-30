const db = require("../models");
const Course = db.courses;
const Op = db.Sequelize.Op;

// Create and Save a new Course
exports.create = async (req, res) => {
  try {
    const { dept, courseNumber, level, hours, name, description } = req.body;

    if (!dept || !courseNumber || !name) {
      return res.status(400).send({ message: "dept, courseNumber and name are required" });
    }

    const course = await Course.create({ dept, courseNumber, level, hours, name, description });
    res.status(201).send(course);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error creating Course" });
  }
};

// Retrieve all Courses (with optional filters)
exports.findAll = async (req, res) => {
  try {
    const { q, dept, level } = req.query;
    const where = {};
    if (dept) where.dept = dept;
    if (level) where.level = level;
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { courseNumber: { [Op.like]: `%${q}%` } },
        { dept: { [Op.like]: `%${q}%` } },
      ];
    }
    const courses = await Course.findAll({ where, order: [["id", "ASC"]] });
    res.send(courses);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error retrieving Courses" });
  }
};

// Find a single Course by id
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).send({ message: `Course id=${id} not found` });
    res.send(course);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error retrieving Course id=${req.params.id}` });
  }
};

// Update a Course by id
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const [affected] = await Course.update(req.body, { where: { id } });
    if (affected === 0) return res.status(404).send({ message: `Course id=${id} not found or no changes` });
    const updated = await Course.findByPk(id);
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message || `Error updating Course id=${req.params.id}` });
  }
};

// Delete a Course by id
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Course.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).send({ message: `Course id=${id} not found` });
    res.send({ message: "Course deleted" });
  } catch (err) {
    res.status(500).send({ message: err.message || `Error deleting Course id=${req.params.id}` });
  }
};

// Delete all Courses
// exports.deleteAll = async (_req, res) => {
//   try {
//     const count = await Course.destroy({ where: {}, truncate: false });
//     res.send({ message: `${count} Courses deleted` });
//   } catch (err) {
//     res.status(500).send({ message: err.message || "Error deleting Courses" });
//   }
// };
