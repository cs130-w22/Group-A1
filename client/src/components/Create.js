import React from 'react';
import { useState } from "react"
import {Calendar, DateObject} from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel";


 function Create  () 
 {     
        const [dates, setDates] = useState();
      
        return (
            
            <div >
              <h1>Create Events</h1>
              <Calendar
                value={dates}
                onChange={setDates}
                multiple
                sort
                format={"MM/DD/YYYY"}
                calendarPosition="bottom-center"
                plugins={[<DatePanel />]}
              />
            </div>
        );
};

export default Create;