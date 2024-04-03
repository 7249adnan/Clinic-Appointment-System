const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql://root:@localhost:3306/doctorapp");


// Define model for Doctor information
const DoctorInfo = sequelize.define('DoctorInfo', {

  email: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING },
  specialist: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },  
  slotTime: { type:DataTypes.INTEGER,defaultValue:10 },

});



// Define model for Doctor Availability information
const AvailableInfo = sequelize.define('AvailableInfo', {

  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  
  isMon: { type:DataTypes.BOOLEAN,defaultValue:true },
  monStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  monEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isTue: { type:DataTypes.BOOLEAN,defaultValue:true },
  tueStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  tueEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isWed: { type:DataTypes.BOOLEAN,defaultValue:true },
  wedStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  wedEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isThu: { type:DataTypes.BOOLEAN,defaultValue:true },
  thuStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  thuEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isFri: { type:DataTypes.BOOLEAN,defaultValue:true },
  friStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  friEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isSat: { type:DataTypes.BOOLEAN,defaultValue:true },
  satStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  satEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },

  isSun: { type:DataTypes.BOOLEAN,defaultValue:true },
  sunStart:{ type:DataTypes.TIME,defaultValue:'11:30:00' },
  sunEnd:{ type:DataTypes.TIME,defaultValue:'17:30:00' },
  
});

// Define association between DoctorInfo and AvailablelInfo
DoctorInfo.hasOne(AvailableInfo, { foreignKey: 'doctorId' });
AvailableInfo.belongsTo(DoctorInfo, { foreignKey: 'doctorId' });

// Define model for Doctor Holiday information
const DoctorHolidayInfo = sequelize.define('DoctorHolidayInfo', {

  doctorId: { type: DataTypes.INTEGER, allowNull: false },    
  holidayStart:{ type:DataTypes.DATEONLY ,allowNull: false},
  holidayEnd:{ type:DataTypes.DATEONLY, allowNull: false },
 
});

// Define association between DoctorInfo and DoctorHolidayInfo
DoctorInfo.hasOne(DoctorHolidayInfo, { foreignKey: 'doctorId' });
DoctorHolidayInfo.belongsTo(DoctorInfo, { foreignKey: 'doctorId' });



sequelize.sync();

async function test(){
  
var abc= await DoctorInfo.create({ name: 'Akhtar', number: '23411156' });
await AvailableInfo.create({ doctorId: 3});
await DoctorHolidayInfo.create({ doctorId:3, holidayStart:'2024-03-11',holidayEnd:'2024-03-15' });

console.log("GET FROM YYYY : "+abc.dataValues.id);

// Perform a join query to fetch data
const userData = await DoctorInfo.findOne({

  where: { id: 3 },
  include:[{model:AvailableInfo},{model:DoctorHolidayInfo}]
  });
console.log(userData.toJSON());

}



setTimeout(() => {
  test();
}, 1000);
