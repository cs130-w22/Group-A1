import React from 'react';
import { useState } from "react"
import DatePicker from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker"





 function Create() {
        const today = new Date()
        const tomorrow = new Date()
      
        tomorrow.setDate(tomorrow.getDate() + 1)
      
        const [values, setValues] = useState([today, tomorrow])
      
        return (
            
            <div style={{ textAlign: "center" }}>
            <p>Create placeholder</p>
            <DatePicker 
                multiple
                value={values} 
                onChange={setValues}
             />
          </div>
        )
}

export default Create;