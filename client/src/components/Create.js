import React from 'react';
import { useState } from "react"
import { Button, Dropdown } from 'react-bootstrap';
import {Calendar, DateObject} from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { apiInstance, authInstance } from '../utils/axiosInstance';


 function Create  () 
 {     
        const [dates, setDates] = useState();
        const [earlistTime, setEarliestTime] = useState(-1);
        const [latestTime, setLatestTime] = useState(-1); 
        const [eventName, setEventName] = useState(""); 
        const [description, setDescription] = useState(""); 
        const [timeZone, setTimeZone] = useState(); 
 

        const hoursInDay = Array.from({length: 24}, (x, i) => i);

        const hoursDisplayFormat = (hour) => {
          if (hour%24 == 0)
            return "12:00 AM"
          else  
            return hour < 13 ? hour + ":00 AM" : (hour%12) + ":00 PM" 
        }

        const handleSubmit = (e) => {
          const url = `/event/create`;
          const body ={
            eventName,
            description,
            earlistTime,
            latestTime,
            dates,
            timeZone 
          }; 
          console.log(body);
          return apiInstance.post(
            url, body,
          )
            .then((res) => res)
            /*
            .catch((err) => {
              throw err;
            });
            */
        }
          

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
              <br></br>
              <label>
                 Event Name:
                 <input 
                  type="text" 
                  placeholder="Event Name"
                  name="eventName" 
                  onChange = {e => setEventName(e.target.value)} 
                />
              </label>
              <br></br>
              <textarea
                name="descriptionTextArea"
                type="text"
                placeholder="Enter Event Description"
                id="descriptionTextArea"
                value = {description}
                onChange = {e => setDescription(e.target.value)}>
                </textarea>
                <br></br>
              <label>
                Earliest Possible Time:
                <select
                  onChange = {e => setEarliestTime(e.target.value)}
                  className="selectEarliestDropdown"
                >
                  <option value="" disabled selected></option> 
                  {hoursInDay.map((hour) => 
                    <option key={hour} value={hour}>
                      {hoursDisplayFormat(hour)}
                    </option>
                  )}
                </select>
              </label>
              <br></br>
              <label>
                Latest Possible Time:
                <select
                  onChange = {e => setLatestTime(e.target.value)}
                  className="selectLatestDropdown"
                >
                  <option value="" disabled selected></option>
                  {hoursInDay.map((hour) => 
                    <option key={hour} value={hour}>
                      {hoursDisplayFormat(hour)}
                    </option>
                  )}
                </select>
              </label>
              <br></br>
              <label>
                Select Time Zone Placeholder:
                <select>
                </select>
              </label> 
              <Button type="submit" onClick={ (e) => handleSubmit()}>
                Create
              </Button>
            </div>
        );
};

export default Create;