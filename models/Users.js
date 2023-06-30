const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for books
class Users extends Model {}

Users.init(
  // Define fields/columns on model
  
  {
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    
  },
  {
    // Link to database connection
    sequelize,
    // Set to false to remove `created_at` and `updated_at` fields
    freezeTableName:true,
    timestamps: false,
    underscored: true,
    modelName: 'users'
  }
);

module.exports = Users;
