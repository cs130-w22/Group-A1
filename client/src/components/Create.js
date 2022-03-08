/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext } from 'react';
import {
  Alert, Button, Dropdown, Form,
} from 'react-bootstrap';

import { Calendar, DateObject } from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { createEvent } from '../api/event';
import { UserContext } from '../utils/context';

import { TITLE } from '../assets/constants';
import { useParams } from 'react-router-dom';
import EventList from './EventList';

function Create() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [dates, setDates] = useState();
  const [earliestTime, setEarliestTime] = useState(0);
  const [latestTime, setLatestTime] = useState(23);
  const [description, setDescription] = useState('');
  const [timeZone, setTimeZone] = useState();
  const hoursInDay = Array.from({ length: 24 }, (x, i) => i);
  const [dateError, setDateError] = useState();
  const [timeError, setTimeError] = useState();

  useEffect(() => {
    document.title = `${TITLE} - create`;
  }, []);

  const { id } = useParams();
  const hoursDisplayFormat = (hour) => {
    if (hour % 24 === 0) return '12:00 AM';
    return hour < 13 ? `${hour}:00 AM` : `${hour % 12}:00 PM`;
  };


  //var created = false;
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },

  } = useForm();

  const onSubmit = (data) => {
    if (dates == null || dates.length === 0) {
      return setDateError('Please select at least one date');
    }
    if (earliestTime >= latestTime) {
      return setTimeError('Latest time must be after earliest time');
    }
    const body = {
      name: data.eventName,
      description,
      timeEarliest: earliestTime,
      timeLatest: latestTime,
      dates,
      timeZone,
    };
    setTimeError(null);
    setDateError(null);

    return createEvent(body)
      .then((res) => {
        navigate(`/event/${res.data}`);
        //created = true;
        //localStorage.setItem("created",JSON.stringify(created));
      }).catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          setError(
            'form',
            { type: 'api', message: "We're sorry! Something went wrong on our end." },
            { shouldFocus: true },
          );
        } else if (error.response.status === 401) {
          setUser(null);
          navigate('/login');
        } else {
          const validationErrors = error.response.data?.errors;
          if (validationErrors?.length > 0) {
            console.log(validationErrors);
            for (let i = 0; i < validationErrors.length; i += 1) {
              const errorParam = validationErrors[i].param;
              const errorMsg = validationErrors[i].msg;
              if (errorParam === 'dates') {
                console.log('wat');
                setDateError(errorMsg);
              } else {
                setError(
                  errorParam,
                  { type: 'api', message: errorMsg },
                  { shouldFocus: true },
                );
              }
            }
          }

        }
      });
  };



  return (
    <div>
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <h2 className="mb-3 fw-bold text-secondary">create event</h2>

      <Calendar
        value={dates}
        onChange={setDates}
        multiple
        sort
        format="MM/DD/YYYY"
        calendarPosition="bottom-center"
        plugins={[<DatePanel />]}
      />
      {dateError !== null && <p className="text-danger mb-1 mt-1">{dateError}</p>}

      <br />
      <Form className="w-50" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>
            Event Name
          </Form.Label>
          <Controller
            control={control}
            name="eventName"
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: 'Event name required',
              },
            }}
            render={({
              field: {
                onChange, value, ref,
              },
            }) => (
              <Form.Control
                onChange={onChange}
                ref={ref}
                value={value}
                isInvalid={errors.eventName}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.eventName?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formDescription" className="mb-3">
          <Form.Label>
            Event Description
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descriptionTextArea"
            placeholder="Enter Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)
            }
          />
        </Form.Group>
        <Form.Group controlId="formEarliest" className="mb-3">
          <Form.Label>
            Earliest Possible Time
          </Form.Label>
          <Form.Select
            aria-label="Select earliest time"
            onChange={(e) => setEarliestTime(e.target.value)}
            className="selectEarliestDropdown"
            value={earliestTime}
          >
            {hoursInDay.map((hour) => (
              <option key={hour} value={hour}>
                {hoursDisplayFormat(hour)}
              </option>
            ))}
          </Form.Select>

        </Form.Group>
        <Form.Group controlId="formLatest" className="mb-3">
          <Form.Label>
            Latest Possible Time
          </Form.Label>
          <Form.Select
            aria-label="Select latest time"
            onChange={(e) => setLatestTime(e.target.value)}
            value={latestTime}
            isInvalid={timeError != null}
            className="selectLatestDropdown"
          >
            {hoursInDay.map((hour) => (
              <option key={hour} value={hour}>
                {hoursDisplayFormat(hour)}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {timeError}
          </Form.Control.Feedback>
        </Form.Group>
        {/* <Form.Group controlId="formLatest" className="mb-3">
        
          <Form.Label>
            Select Time Zone (placeholder)
          </Form.Label>
          <Form.Select
            aria-label="Select time zone"
          />

        </Form.Group> */}
        <Button variant="outline-primary" className="fw-bold" type="submit">

          create event
        </Button>

      </Form>
    </div>
  );
}

export default Create;
