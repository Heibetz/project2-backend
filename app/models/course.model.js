module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define(
    "course",
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      dept: {
        type: Sequelize.STRING(16),
        allowNull: false,
        field: "Dept",
      },
      courseNumber: {
        type: Sequelize.STRING(32),
        allowNull: false,
        field: "Course Number",
      },
      level: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        field: "Level",
      },
      hours: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        field: "Hours",
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "Name",
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: "Description",
      },
    },
    {
      tableName: "courses",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Course;
};
