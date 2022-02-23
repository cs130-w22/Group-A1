import React, { useState, useContext, useEffect } from 'react';
import {
  Alert, Button, Card, Form, Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { editEvent, deleteEvent } from '../api/event';
import { UserContext } from '../utils/context';
import { EventButton } from './EventButton';

function EventEdit(eventData) {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState();
  const [eventName, setEventName] = useState({ eventData }?.name);
  const [description, setDescription] = useState({ eventData }?.description);
  const [editing, setEditing] = useState(true);
  const eventId = { eventData }?._id;
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (bodyData) => {
    const body = {
      name: bodyData.eventName,
      owner: bodyData.eventOwner,
      description,
    };
    return editEvent(eventId, body)
      .then((res) => {
        navigate(`/event/${eventId}`);
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
          const validationErrors = error.data?.errors;
          if (validationErrors?.length > 0) {
            for (let i = 0; i < validationErrors.length; i += 1) {
              const errorParam = validationErrors[i].param;
              const errorMsg = validationErrors[i].msg;
              setError(
                errorParam,
                { type: 'api', message: errorMsg },
                { shouldFocus: true },
              );
            }
          }
        }
      });
  };

  const closeEditingWindow = () => {
    setEditing(false);
  };

  const handleDeletion = (e) => {
    deleteEvent(eventId)
      .then((res) => {
        navigate('/');
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
          const validationErrors = error.data?.errors;
          if (validationErrors?.length > 0) {
            for (let i = 0; i < validationErrors.length; i += 1) {
              const errorParam = validationErrors[i].param;
              const errorMsg = validationErrors[i].msg;
              setError(
                errorParam,
                { type: 'api', message: errorMsg },
                { shouldFocus: true },
              );
            }
          }
        }
      });
  };

  return (
    <div>
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Modal show={editing} onHide={closeEditingWindow()} centered>
        <Form className="w-50" onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title className="mt-5">Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card id={eventId} className="border py-4 px-4 mb-3">
              <Form.Group controlId="formName" className="mb-3">
                <Controller
                  control={control}
                  name="eventName"
                  defaultValue={eventName}
                  placeholder="Enter Event Name"
                  reules={{
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
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descriptionTextArea"
                  placeholder="Enter Event Description"
                  defaultValue={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <hr className="mt-4" />
              <EventButton variant="warning" className="ms-2 " onClick={handleDeletion()}>delete</EventButton>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <EventButton variant="success" className="ms-2 " type="submit">save</EventButton>
            <EventButton variant="outline-secondary" className="ms-2 " onClick={closeEditingWindow()}>cancel</EventButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

EventEdit.propTypes = {
  eventData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default EventEdit;
