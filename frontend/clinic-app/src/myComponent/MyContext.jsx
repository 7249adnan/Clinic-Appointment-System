// MyContext.js
import React, { useState, createContext } from 'react';

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {

  const [value, setValue] = useState('n');

  return (
    <> 
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
    
    </>
  );
};
