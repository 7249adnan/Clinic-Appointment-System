var Express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var cors = require("cors");

// To Handle DataBase
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("mysql://root:@localhost:3306/doctorapp");
const { Op } = require("sequelize");

var app = Express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;

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

// Define model for Doctor information
const DoctorInfo = sequelize.define("DoctorInfo", {
  email: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING },
  specialist: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  slotTime: { type: DataTypes.INTEGER, defaultValue: 10 },
});

// Define model for Doctor Availability information
const AvailableInfo = sequelize.define("AvailableInfo", {
  doctorId: { type: DataTypes.INTEGER, allowNull: false },

  isMon: { type: DataTypes.BOOLEAN, defaultValue: true },
  monStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  monEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isTue: { type: DataTypes.BOOLEAN, defaultValue: true },
  tueStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  tueEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isWed: { type: DataTypes.BOOLEAN, defaultValue: true },
  wedStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  wedEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isThu: { type: DataTypes.BOOLEAN, defaultValue: true },
  thuStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  thuEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isFri: { type: DataTypes.BOOLEAN, defaultValue: true },
  friStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  friEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isSat: { type: DataTypes.BOOLEAN, defaultValue: true },
  satStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  satEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },

  isSun: { type: DataTypes.BOOLEAN, defaultValue: true },
  sunStart: { type: DataTypes.TIME, defaultValue: "11:30:00" },
  sunEnd: { type: DataTypes.TIME, defaultValue: "17:30:00" },
});

// Define association between DoctorInfo and AvailablelInfo
DoctorInfo.hasOne(AvailableInfo, { foreignKey: "doctorId" });
AvailableInfo.belongsTo(DoctorInfo, { foreignKey: "doctorId" });

// Define model for Doctor Holiday information
const DoctorHolidayInfo = sequelize.define("DoctorHolidayInfo", {
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  holidayStart: { type: DataTypes.DATEONLY, allowNull: false },
  holidayEnd: { type: DataTypes.DATEONLY, allowNull: false },
});

// Define association between DoctorInfo and DoctorHolidayInfo
DoctorInfo.hasOne(DoctorHolidayInfo, { foreignKey: "doctorId" });
DoctorHolidayInfo.belongsTo(DoctorInfo, { foreignKey: "doctorId" });

//Appointment Table
const AppointmentInfo = sequelize.define("AppointmentInfo", {
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  totalFees: { type: DataTypes.INTEGER, allowNull: false },
  advancedFees: { type: DataTypes.INTEGER },
  remainingFees: { type: DataTypes.INTEGER },
  paidFees: { type: DataTypes.INTEGER },
});

// Define association between DoctorInfo and  AppointmentInfo
User.hasOne(AppointmentInfo, { foreignKey: "patientId" });
AppointmentInfo.belongsTo(User, { foreignKey: "patientId" });

// Define association between DoctorInfo and  AppointmentInfo
DoctorInfo.hasOne(AppointmentInfo, { foreignKey: "doctorId" });
AppointmentInfo.belongsTo(DoctorInfo, { foreignKey: "doctorId" });

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server is Listining on PORT : ${PORT}`);
});

const SECRET_KEY = "Info1234"; // Replace with your own secret key

app.post("/loginTest", (req, res) => {
  const { username, password } = req.body;

  // Mock authentication logic (replace with your actual authentication logic)
  const user = usersa.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    SECRET_KEY,
    { expiresIn: "10000" }
  );
  console.log(token);
  res.json({ token });
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed successfully" });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
}

app.post("/loginForm", (req, res) => {
  //console.log("Name : " + req.body.email + "\n ### Data Fetched ..... ");

  const user = getUserByEmail(req.body.email)
    .then((user) => {
      console.log("User fetched successfully:", user);
      if (user.password == req.body.password) {
        const token = jwt.sign(
          { userId: user.id, userName: user.name, loggedIn: "confirm" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
        console.log(token);
        res.json({ token });

        // res.send("pyes");
      } else {
        // console.log(" \n\n \n user P : "+ user.password);
        // console.log(" \n user P : "+ req.body.password);

        res.send("pno");
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);

      res.send("eno");
    });
});

app.post("/createPatient", (req, res) => {
  var p = req.body;

  const randomPassword = generateRandomPassword();

  const patient = insertPatient(
    p.name,
    p.email,
    p.mobile,
    randomPassword,
    p.gender,
    p.address,
    p.zipcode
  )
    .then(() => {
      console.log("User inserted successfully");
      res.send("createdOK");
    })
    .catch((error) => {
      console.error("Error inserting user:", error);
    });

  console.log(p);
});

app.post("/deletePatient", (req, res) => {
  var rowAffected = deleteUser(req.body.deleteID)
    .then((rowAffected) => {
      console.log("User Deleted successfully :: " + rowAffected);
      res.send("yes");
    })
    .catch((error) => {
      console.error("Error Deleting user:", error);
    });

  // let patient = getPatients().then((patient1) => {
  //   console.log(patient1);
  //     res.json(patient1);
  //   })
  //   .catch((error) => {
  //     console.error("Error Fetching user:", error);
  //   });

  console.log(req.body.deleteID);
});

app.post("/getPatient", (req, res) => {
  let patient = getPatients()
    .then((patient1) => {
      console.log(patient1);
      res.json(patient1);
    })
    .catch((error) => {
      console.error("Error Fetching user:", error);
    });
});

app.post("/getOnePatient", (req, res) => {
  let patient = getOnePatients(req.body.patientID)
    .then((patientData) => {
      console.log("get one data Patient 420");
      console.log(patientData);
      res.json(patientData);
    })
    .catch((error) => {
      console.error("Error Fetching user:", error);
    });
});

app.post("/updatePatient", (req, res) => {
  var p = req.body;

  //updateUser(1,{gender:'female',zipcode:400062});

  const patient = updatePatient(p.id, {
    name: p.name,
    email: p.email,
    number: p.number,
    gender: p.gender,
    address: p.address,
    zipcode: p.zipcode,
  })
    .then(() => {
      console.log("User Updated successfully");
      res.send("updatedOK");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });

  console.log(p);
});

async function updatePatient(id, newdata) {
  try {
    const user = await User.update(newdata, { where: { id }, returning: true });
    console.log("User updated:" + user);
  } catch (error) {
    console.error("Error Updating users:", error);

    throw error;
  }
}

app.post("/findUserBy", (req, res) => {
  let patient = findUserBy(req.body.string, req.body.coloumn)
    .then((searchData) => {
      console.log("searchData");
      console.log(searchData);
      res.json(searchData);
    })
    .catch((error) => {
      console.error("Error Fetching user:", error);
    });

  console.log(req.body.string);
});

async function findUserBy(pattern, searchBy) {
  try {
    const users = await User.findAll({
      where: {
        [searchBy]: {
          [Op.like]: `%${pattern}%`,
        },
        isPatient: 1,
      },
    });
    return users;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
}

async function getOnePatients(selectedID) {
  try {
    const users = await User.findOne({ where: { id: selectedID } });
    console.log("hello in get one pateint 1112 ");
    return users;
  } catch (error) {
    /// see what happening here !!!!!!!!!!!!!!!!!!xa
    console.error("Error retrieving users:", error);

    throw error;
  }
}

async function deleteUser(selectedID) {
  try {
    const rowsAffected = await User.destroy({ where: { id: selectedID } })
      .then((rowsDeleted) => {
        console.log(`Deleted ${rowsDeleted} row(s)`);
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  } catch (error) {
    console.error("Error Deleting users:", error);
    throw error;
  }
}

async function getPatients() {
  try {
    const users = await User.findAll({
      where: {
        isPatient: 1,
      },
    });

    return users;
  } catch (error) {
    console.error("Error retrieving users:", error);

    throw error;
  }
}

async function insertPatient(
  name,
  email,
  number,
  password,
  gender,
  address,
  zipcode
) {
  try {
    // Insert data into the User table
    const patient = await User.create({
      name,
      number,
      email,
      password,
      gender,
      address,
      zipcode,
    });
    console.log("patient Created :", patient.toJSON());

    return patient;
  } catch (error) {
    console.error("Error inserting Patient :", error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    // Read data from the User table based on the provided email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    console.log("User found:", user.toJSON());
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

function generateRandomPassword() {
  const specialChars = "@#$&_";
  const digits = "0123456789";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";

  let password = "";

  // Generate 1 special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Generate 1 digit
  password += digits.charAt(Math.floor(Math.random() * digits.length));

  // Generate 3 uppercase letters
  for (let i = 0; i < 3; i++) {
    password += uppercaseLetters.charAt(
      Math.floor(Math.random() * uppercaseLetters.length)
    );
  }

  // Generate 3 lowercase letters
  for (let i = 0; i < 3; i++) {
    password += lowercaseLetters.charAt(
      Math.floor(Math.random() * lowercaseLetters.length)
    );
  }

  // Shuffle the password characters
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}

/// ----- DOCTOR SECTION START -------

app.post("/createDoctor", (req, res) => {
  var p = req.body;

  const randomPassword = generateRandomPassword();

  var value = true;

  if (p.isActive == "no") {
    value = false;
  }

  const doctor = insertDoctor(
    p.name,
    p.email,
    p.mobile,
    randomPassword,
    value,
    p.specialist,
    p.slotTime
  )
    .then((data) => {
      console.log("Doctor inserted successfully DID :" + data.id);
      insertDoctorAvail(data.id);
      res.send("createdOK");
    })
    .catch((error) => {
      console.error("Error inserting user:", error);
    });
  console.log(p);
});

async function insertDoctor(
  name,
  email,
  number,
  password,
  isActive,
  specialist,
  slotTime
) {
  try {
    // Insert data into the User table
    const Doctor = await DoctorInfo.create({
      name,
      number,
      email,
      password,
      isActive,
      specialist,
      slotTime,
    });
    console.log("Doctor Created :", Doctor.toJSON());
    return Doctor;
  } catch (error) {
    console.error("Error inserting Doctor :", error);
    throw error;
  }
}

async function insertDoctorAvail(doctorId) {
  console.log("Doctor ID for Avail : " + doctorId);

  try {
    // Insert data into the User table
    const Doctor = await AvailableInfo.create({ doctorId });
    console.log("Doctor Created :", Doctor.toJSON());
    return Doctor;
  } catch (error) {
    console.error("Error inserting Doctor :", error);
    throw error;
  }
}

app.post("/getDoctor", (req, res) => {
  let patient = getDoctors()
    .then((patient1) => {
      console.log(patient1);
      res.json(patient1);
    })
    .catch((error) => {
      console.error("Error Fetching Doctors:", error);
    });
});

async function getDoctors() {
  try {
    const Doctors = await DoctorInfo.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return Doctors;
  } catch (error) {
    console.error("Error retrieving  Doctors:", error);

    throw error;
  }
}

app.post("/findDoctorBy", (req, res) => {
  let doctor = findDoctorBy(req.body.string, req.body.coloumn)
    .then((searchData) => {
      console.log("searchData");
      console.log(searchData);
      res.json(searchData);
    })
    .catch((error) => {
      console.error("Error Fetching Doctor:", error);
    });

  console.log(req.body.string);
});

async function findDoctorBy(pattern, searchBy) {
  try {
    const doctors = await DoctorInfo.findAll({
      where: {
        [searchBy]: {
          [Op.like]: `%${pattern}%`,
        },
      },
    });
    return doctors;
  } catch (error) {
    console.error("Error finding Doctor :", error);
    throw error;
  }
}

app.post("/deleteDoctor", (req, res) => {
  var rowAffected = deleteDoctor(req.body.deleteID)
    .then((rowAffected) => {
      console.log("Doctor Deleted successfully :: " + rowAffected);
      res.send("yes");
    })
    .catch((error) => {
      console.error("Error Deleting Doctor:", error);
    });

  console.log(req.body.deleteID);
});

async function deleteDoctor(selectedID) {
  try {
    const rowsAffected = await DoctorInfo.destroy({ where: { id: selectedID } })
      .then((rowsDeleted) => {
        console.log(`Deleted ${rowsDeleted} row(s)`);
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  } catch (error) {
    console.error("Error Deleting Doctor : ", error);
    throw error;
  }
}

app.post("/getOneDoctor", (req, res) => {
  let doctor = getOneDoctors(req.body.doctorID)
    .then((doctorData) => {
      console.log("get one Doctor");
      console.log(doctorData);
      res.json(doctorData);
    })
    .catch((error) => {
      console.error("Error Fetching user:", error);
    });
});

async function getOneDoctors(selectedID) {
  try {
    const doctor = await DoctorInfo.findOne({ where: { id: selectedID } });

    return doctor;
  } catch (error) {
    console.error("Error retrieving doctor:", error);

    throw error;
  }
}

app.post("/getOneAvailability", (req, res) => {
  let doctor = getOneAvail(req.body.doctorID)
    .then((doctorAvailData) => {
      console.log("get one Doctor Avail");
      console.log(doctorAvailData);
      res.json(doctorAvailData);
    })
    .catch((error) => {
      console.error("Error Fetching avail:", error);
    });
});

async function getOneAvail(selectedID) {
  try {
    const doctorAvail = await AvailableInfo.findOne({
      where: { doctorId: selectedID },
    });

    return doctorAvail;
  } catch (error) {
    console.error("Error retrieving doctorAvail :", error);

    throw error;
  }
}

app.post("/createDoctorHoliday", (req, res) => {
  var p = req.body;

  const doctorHoliday = insertDoctorHoliday(p.doctorID, p.startDate, p.endDate)
    .then(() => {
      console.log("Doctor Holiday  inserted successfully");
      res.send("createdOK");
    })
    .catch((error) => {
      console.error("Error inserting Holiday user:", error);
    });

  console.log(p);
});

async function insertDoctorHoliday(doctorId, holidayStart, holidayEnd) {
  try {
    // Insert data into the User table
    const Doctor = await DoctorHolidayInfo.create({
      doctorId,
      holidayStart,
      holidayEnd,
    });
    console.log("Doctor Holiday  Created :", Doctor.toJSON());
    return Doctor;
  } catch (error) {
    console.error("Error inserting Doctor Holiday :", error);
    throw error;
  }
}

app.post("/getDoctorHolidayDates", (req, res) => {
  var p = req.body;

  let doctorHoliday = getDoctorHolidays(p.doctorID)
    .then((doctorHolidays) => {
      console.log(doctorHolidays);
      res.json(doctorHolidays);
    })
    .catch((error) => {
      console.error("Error Fetching Doctor Holidays:", error);
    });
});

async function getDoctorHolidays(id) {
  try {
    const doctorHolidays = await DoctorHolidayInfo.findAll({
      where: {
        doctorId: id,
      },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    return doctorHolidays;
  } catch (error) {
    console.error("Error retrieving  doctorHolidays:", error);

    throw error;
  }
}

app.post("/deleteDoctorHoliday", (req, res) => {
  var rowAffected = deleteDoctorHoliday(req.body.deleteID)
    .then((rowAffected) => {
      console.log("Doctor Holiday Deleted successfully :: " + rowAffected);
      res.send("yes");
    })
    .catch((error) => {
      console.error("Error Deleting Doctor:", error);
    });

  console.log(req.body.deleteID);
});

async function deleteDoctorHoliday(selectedID) {
  try {
    const rowsAffected = await DoctorHolidayInfo.destroy({
      where: { id: selectedID },
    })
      .then((rowsDeleted) => {
        console.log(`Deleted ${rowsDeleted} row(s)`);
      })
      .catch((error) => {
        console.error("Error deleting row:", error);
      });
  } catch (error) {
    console.error("Error Deleting Doctor : ", error);
    throw error;
  }
}

app.post("/updateDoctorHoliday", (req, res) => {
  var p = req.body;

  //updateUser(1,{gender:'female',zipcode:400062});

  const patient = updateDoctorHoliday(p.ID, {
    holidayStart: p.startDate,
    holidayEnd: p.endDate,
  })
    .then(() => {
      console.log("Doctor Holiday Updated successfully");
      res.send("updatedOK");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });

  console.log(p);
});

async function updateDoctorHoliday(id, newdata) {
  try {
    const user = await DoctorHolidayInfo.update(newdata, {
      where: { id },
      returning: true,
    });
    console.log("User updated:" + user);
  } catch (error) {
    console.error("Error Updating users:", error);

    throw error;
  }
}

app.post("/updateDoctorBasicInfo", (req, res) => {
  var p = req.body;

  var value = true;

  if (p.isActive == "no") {
    value = false;
  }

  const patient = updateDoctorBasicInfo(p.id, {
    email: p.email,
    name: p.name,
    number: p.number,
    specialist: p.specialist,
    isActive: value,
    slotTime: p.slotTime,
  })
    .then(() => {
      console.log("Doctor Basic Updated successfully 2323 ");
      res.send("updatedOK");
    })
    .catch((error) => {
      console.error("Error updating Doctor :", error);
    });

  console.log(p);
});

async function updateDoctorBasicInfo(id, newdata) {
  try {
    const doctor = await DoctorInfo.update(newdata, {
      where: { id },
      returning: true,
    });
    console.log("Doctor updated:" + doctor);
  } catch (error) {
    console.error("Error Updating users:", error);

    throw error;
  }
}

app.post("/updateDoctorAvailInfo", (req, res) => {
  var p = req.body;

  const patient = updateDoctorAvailableInfo(p.id, {
    isMon: p.isMon,
    monStart: p.monStart,
    monEnd: p.monEnd,
    isTue: p.isTue,
    tueStart: p.tueStart,
    tueEnd: p.tueEnd,
    isWed: p.isWed,
    wedStart: p.wedStart,
    wedEnd: p.wedEnd,
    isThu: p.isThu,
    thuStart: p.thuStart,
    thuEnd: p.thuEnd,
    isFri: p.isFri,
    friStart: p.friStart,
    friEnd: p.friEnd,
    isSat: p.isSat,
    satStart: p.satStart,
    satEnd: p.satEnd,
    isSun: p.isSun,
    sunStart: p.sunStart,
    sunEnd: p.sunEnd,
  })
    .then(() => {
      console.log("Doctor Basic Updated successfully 1111 ");
      res.send("updatedOK");
    })
    .catch((error) => {
      console.error("Error updating Doctor :", error);
    });

  console.log(p);
});

async function updateDoctorAvailableInfo(id, newdata) {
  console.log(newdata);

  try {
    const doctor = await AvailableInfo.update(newdata, {
      where: { id },
      returning: true,
    });
    console.log("Doctor updated:" + doctor);
  } catch (error) {
    console.error("Error Updating users:", error);

    throw error;
  }
}

/// ----- Appointment SECTION START -------

app.post("/createAppointment", (req, res) => {
  var p = req.body;

  const doctor = insertAppointment(
    p.patientId,
    p.doctorId,
    p.startDate,
    p.startTime,
    p.status,
    p.totalFees,
    p.advancedFees,
    p.remainingFees,
    p.paidFees
  )
    .then((data) => {
      console.log("AppointMent inserted successfully  :" + data);
      res.send("createdOK");
    })
    .catch((error) => {
      console.error("Error inserting Appointment:", error);
    });
  console.log(p);
});

async function insertAppointment(
  patientId,
  doctorId,
  startDate,
  startTime,
  status,
  totalFees,
  advancedFees,
  remainingFees,
  paidFees
) {
  try {
    // Insert data into the User table
    const Appointment = await AppointmentInfo.create({
      patientId,
      doctorId,
      startDate,
      startTime,
      status,
      totalFees,
      advancedFees,
      remainingFees,
      paidFees,
    });
    // console.log("Appointment Created :", Appointment.toJSON());
    return Appointment;
  } catch (error) {
    console.error("Error inserting Appointment :", error);
    throw error;
  }
}

app.post("/getAppointment", (req, res) => {
  let doctor = getAppointmentBy(req.body.appointmentDate, req.body.doctorId)
    .then((searchData) => {
      console.log("searchData");
      console.log(searchData);
      res.json(searchData);
    })
    .catch((error) => {
      console.error("Error Fetching Doctor:", error);
    });

  console.log(req.body.appointmentDate);
});

async function getAppointmentBy(mystartDate, mydoctorId) {
  try {
    const appointment = await AppointmentInfo.findAll({
      where: {
        doctorId: mydoctorId,
        startDate: {
          [Op.eq]: mystartDate,
        },
      },
      include: {
        model: User,
        attributes: ['name', 'number'] 
      }
    });

    
    return appointment;
  } catch (error) {
    console.error("Error finding Doctor :", error);
    throw error;
  }
}

app.post("/checkDoctorHoliday", (req, res) => {
  var rowAffected = checkDoctorHoliday(req.body.date, req.body.doctorId)
    .then((holidayDates) => {
      console.log("holidayDates :");
      console.log(holidayDates);
      var val = checkDoctorHolidayDates(holidayDates, req.body.date);
      res.json(val);
    })
    .catch((error) => {
      console.error("Error Deleting Doctor:", error);
    });

  console.log(req.body.deleteID);
});

async function checkDoctorHoliday(myDate, myDoctorId) {
  console.log("tocheck Date : " + myDate);
  console.log("tocheck Doctor Id : " + myDoctorId);

  try {
    const doctors = await DoctorHolidayInfo.findAll({
      where: {
        doctorId: myDoctorId,
      },
    });
    return doctors;
  } catch (error) {
    console.error("Error finding Doctor :", error);
    throw error;
  }
}

function checkDoctorHolidayDates(dates, checkDate) {
  console.log("Date " + checkDate);

  for (let i = 0; i < dates.length; i++) {
    const item = dates[i];

    var date = new Date(checkDate);
    var startDate = new Date(item.holidayStart);
    var endDate = new Date(item.holidayEnd);

    if (date >= startDate && date <= endDate) {
      return 0;
    }
    console.log(item.id, item.holidayStart, item.holidayEnd);
  }
  return 1;
}

app.post("/checkDoctorAvailabilityTime", (req, res) => {
  var rowAffected = getDoctorAvailabilityTime(req.body.date, req.body.doctorId)
    .then((Avail) => {
      console.log("Avail :");
      console.log(Avail);

      res.json(Avail);
    })
    .catch((error) => {
      console.error("Error Deleting Doctor:", error);
    });

  console.log(req.body.deleteID);
});

async function getDoctorAvailabilityTime(myDate, myDoctorId) {
  try {
    const doctorAvail = await AvailableInfo.findOne({
      where: { doctorId: myDoctorId },
    });

    const doctorInfo = await DoctorInfo.findOne({ where: { id: myDoctorId } });

    var data = sortAvailTime(myDate, doctorAvail, doctorInfo.slotTime);
    return data;
  } catch (error) {
    console.error("Error finding Doctor :", error);
    throw error;
  }
}

function sortAvailTime(myDate, doctorAvail, myslotTime) {
  const date = new Date(myDate);
  const dayIndex = date.getDay();

  const availTime = {
    doctorPresent: true,
    startTime: "",
    endTime: "",
    day: "",
    slotTime: myslotTime,
  };

  if (dayIndex == 1 && doctorAvail.isMon == true) {
    availTime.startTime = doctorAvail.monStart;
    availTime.endTime = doctorAvail.monEnd;
    availTime.day = "Monday";
  } else if (dayIndex == 2 && doctorAvail.isTue == true) {
    availTime.startTime = doctorAvail.tueStart;
    availTime.endTime = doctorAvail.tueEnd;
    availTime.day = "Tuesday";
  } else if (dayIndex == 3 && doctorAvail.isWed == true) {
    availTime.startTime = doctorAvail.wedStart;
    availTime.endTime = doctorAvail.wedEnd;
    availTime.day = "Wednesday";
  } else if (dayIndex == 4 && doctorAvail.isThu == true) {
    availTime.startTime = doctorAvail.thuStart;
    availTime.endTime = doctorAvail.thuEnd;
    availTime.day = "Thursday";
  } else if (dayIndex == 5 && doctorAvail.isFri == true) {
    availTime.startTime = doctorAvail.friStart;
    availTime.endTime = doctorAvail.friEnd;
    availTime.day = "Friday";
  } else if (dayIndex == 6 && doctorAvail.isSat == true) {
    availTime.startTime = doctorAvail.satStart;
    availTime.endTime = doctorAvail.satEnd;
    availTime.day = "Saturday";
  } else if (dayIndex == 7 && doctorAvail.isSun == true) {
    availTime.startTime = doctorAvail.sunStart;
    availTime.endTime = doctorAvail.sunEnd;
    availTime.day = "Sunday";
  } else {
    availTime.doctorPresent = false;
  }

  return availTime;
}
