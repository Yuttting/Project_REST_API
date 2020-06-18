const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model{}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type:Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a first name.'
                },
                notEmpty: {
                    msg: 'First name is required.'
                }
            }
        },
        lastName: {
            type:Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a last name.'
                },
                notEmpty: {
                    msg: 'Last name is required.'
                }
            }
        },
        emailAddress: {
            type:Sequelize.STRING,
            allowNull: false,
            isEmail: true,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Please provide an email address.'
                },
                notEmpty: {
                    msg: 'Email address is required.'
                }
            }
        },
        password: {
            type:Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a password.'
                },
                notEmpty: {
                    msg: 'Password is required.'
                }
            }
        }
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course), {
            //as: 'owner',
            foreignKey: {
                fieldName: 'userId',
                field: 'userId',
                allowNull: false,
            }
        }
    };

    return User;

}