const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create a new Sequelize model for books
class Songs extends Model {}

Songs.init(
  // Define fields/columns on model
  // An `id` is automatically created by Sequelize, though best practice would be to define the primary key ourselves
  {
   
    name: {
      type: DataTypes.STRING
    },
    artist: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
  },
  {
    // Link to database connection
    sequelize,
    // Set to false to remove `created_at` and `updated_at` fields
    timestamps: false,
    underscored: true,
    modelName: 'songs'
  }
);

module.exports = Songs;
