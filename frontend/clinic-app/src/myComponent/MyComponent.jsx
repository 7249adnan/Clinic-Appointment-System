// MyComponent.js
import React, { useContext } from 'react';
import { MyContext } from './MyContext';


function MyComponent(props) {
  const { value, setValue } = useContext(MyContext);

  const handleClick = () => {
    setValue('New Value BB');
    props.navStatus(1);
  };
  const handleClick2 = () => {
    setValue('New Value BB');
    props.navStatus(2);
  };

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={handleClick}>Update Value</button>
      <button onClick={handleClick2}>Update Value</button>
      
    </div>
  );
}

export default MyComponent;
