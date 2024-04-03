
// const [hour, setHour] = useState("");
// const [minute, setMinute] = useState("");

// const handleHourChange = (event) => {
//   setHour(event.target.value);
// };

// const handleMinuteChange = (event) => {
//   setMinute(event.target.value);
// };


<Row className="pb-3">
<Col>
  <Form.Group controlId="formName">
    <Form.Label className="labelfont">Monday </Form.Label>
    <Form.Check
      type="checkbox"
      label="Present"
      id="exampleCheckbox"
    />
    <div className="startTime">
      <label htmlFor="" className="startTimeLabel">
        Start Time : &nbsp;{" "}
      </label>
      <select value={hour} onChange={handleHourChange}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i < 10 ? `0${i}` : `${i}`}>
            {i < 10 ? `0${i}` : `${i}`}
          </option>
        ))}
      </select>
      :
      <select value={minute} onChange={handleMinuteChange}>
        {Array.from({ length: 4 }, (_, i) => (
          <option
            key={i * 15}
            value={i * 15 < 10 ? `0${i * 15}` : `${i * 15}`}
          >
            {i * 15 < 10 ? `0${i * 15}` : `${i * 15}`}
          </option>
        ))}
      </select>
    </div>
    <div className="startTime" style={{paddingTop:"1%"}} >
      <label htmlFor="" className="startTimeLabel">
      End Time : &nbsp;&nbsp;&nbsp;{" "}
      </label>
      <select value={hour} onChange={handleHourChange}>
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={i < 10 ? `0${i}` : `${i}`}>
            {i < 10 ? `0${i}` : `${i}`}
          </option>
        ))}
      </select>
      :
      <select value={minute} onChange={handleMinuteChange}>
        {Array.from({ length: 4 }, (_, i) => (
          <option
            key={i * 15}
            value={i * 15 < 10 ? `0${i * 15}` : `${i * 15}`}
          >
            {i * 15 < 10 ? `0${i * 15}` : `${i * 15}`}
          </option>
        ))}
      </select>
    </div>
  </Form.Group>
</Col>
</Row>


function generateRandomPassword() {
    const specialChars = '@#$&*()_';
    const digits = '0123456789';
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  
    let password = '';
  
    // Generate 1 special character
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  
    // Generate 1 digit
    password += digits.charAt(Math.floor(Math.random() * digits.length));
  
    // Generate 2 uppercase letters
    for (let i = 0; i < 3; i++) {
      password += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));
    }
  
    // Generate 2 lowercase letters
    for (let i = 0; i < 3; i++) {
      password += lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length));
    }
  
    // Shuffle the password characters
    password = password.split('').sort(() => Math.random() - 0.5).join('');
  
    return password;
  }
  

  export default generateRandomPassword
  