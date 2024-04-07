const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql://root:@localhost:3306/doctorapp");

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  zipcode: { type: DataTypes.INTEGER },
  isDoctor: { type: DataTypes.BOOLEAN, defaultValue: false },
  isStaff: { type: DataTypes.BOOLEAN, defaultValue: false },
  isPatient: { type: DataTypes.BOOLEAN, defaultValue: true },
});

sequelize.sync();

async function insertUser(name, email, number, password) {
  const user = await User.create({ name, number, email, password });
  console.log("User inserted:", user.toJSON());
}

async function updateUser(id, newdata) {
  const user = await User.update(newdata, { where: { id }, returning: true });
  console.log("User updated:" + user);
}

async function deleteUser(email) {
  const rowAffected = await User.destroy({ where: { email } });
  console.log("User Deleted:" + rowAffected);
}

async function getUsers() {
  const users = await User.findAll();

  console.log(
    "Users:",
    users.map((user) => user.toJSON())
  );
  return users;
}

async function getUserByEmail(email) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error(`User with email ${email} not found`);
  }

  console.log("User found:", user.password );
  return user;
}

//insertUser("rahil", "abc@gmail.com", "+91 344234435", "werw3dfg4e55");
//updateUser(1,{gender:'female',zipcode:400062});
//deleteUser("abc@gmail.com");
//getUsers();
//getUserByEmail('abc@gmail.com3');




// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'doctorapp'
// });

// connection.connect();

// connection.query('SELECT * FROM demo', (error, results, fields) => {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

// connection.end();
