const Sequelize = require('sequelize');

// Course
// id (Integer, primary key, auto-generated)
// userId (id from the Users table)
// title (String)
// description (Text)
// estimatedTime (String, nullable)
// materialsNeeded (String, nullable)

module.exports = (sequelize) => {
    class Course extends sequelize.module{};
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a title.'
                },
                notEmpty: {
                    msg: 'Title is required.'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a description.'
                },
                notEmpty: {
                    msg: 'Description is required.'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, { sequelize })

    Course.belongsTo(models.User, {
        //as:'',
        foreighKey: {
            fieldName: 'userID',
            field: 'userID',
            allowNull: false,
        },
    });

    return Course;
}