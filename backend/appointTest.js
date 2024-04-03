const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql://root:@localhost:3306/doctorapp");

sequelize.sync();

const DoctorInfo = sequelize.define('DoctorInfo', {

    email: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING },
    specialist: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },  
    slotTime: { type:DataTypes.INTEGER,defaultValue:10 },
  
  });