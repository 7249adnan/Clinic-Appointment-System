// models/user.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://root:@localhost:3306/doctorapp');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

async function main() {
    try {
      await User.sync({ force: true });
      console.log('User table created successfully.');
    } catch (error) {
      console.error('Error creating User table:', error);
    }
  }
  
  main();
