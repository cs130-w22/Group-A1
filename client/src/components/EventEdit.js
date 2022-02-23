import React, { useState, useContext, useEffect } from 'react';
import { Alert, Card, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import PropTypes, { any } from 'prop-types';
import { editEvent, deleteEvent } from '../api/event';
import { UserContext } from '../utils/context';
import { EventButton } from './EventButton';

function EventEdit(props) {
  const { user, setUser } = useContext(UserContext);
  const [eventName, setEventName] = useState(props.editName);
  const [description, setDescription] = useState(props.editDescription);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(eventName);
    console.log(description);
    console.log(props.eventId);
  }, [eventName, description, props.eventId]);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    const body = {
      name: eventName,
      description,
    };
    return editEvent(props.eventId, body)
      .then((res) => {
        navigate(`/event/${props.eventId}`);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          setError(
            'form',
            {
              type: 'api',
              message: "We're sorry! Something went wrong on our end.",
            },
            { shouldFocus: true }
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
                { shouldFocus: true }
              );
            }
          }
        }
      });
  };

  const handleDeletion = () => {
    deleteEvent(props.eventId)
      .then((res) => {
        if (window.location.pathname !== '/') navigate('/');
        else window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          setError(
            'form',
            {
              type: 'api',
              message: "We're sorry! Something went wrong on our end.",
            },
            { shouldFocus: true }
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
                { shouldFocus: true }
              );
            }
          }
        }
      });
  };

  return (
    <div>
      {errors.form && <Alert variant="danger">{errors.form}</Alert>}
      <Modal show={props.editing} onHide={props.closeEditor} centered>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title className="mt-5">Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Control
                type="text"
                onChange={(e) => setEventName(e.target.value)}
                value={eventName || ''}
                isInvalid={errors.eventName}
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
          </Modal.Body>
          <Modal.Footer>
            <EventButton
              variant="success"
              className="ms-2 "
              type="submit"
              onClick={onSubmit}
            >
              save
            </EventButton>
            <EventButton
              variant="danger"
              className="ms-2 "
              onClick={handleDeletion}
            >
              delete
            </EventButton>
            <EventButton
              variant="outline-primary"
              className="ms-2 "
              onClick={() => props.closeEditor()}
            >
              cancel
            </EventButton>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

/*
EventEdit.propTypes = {
  editing: PropTypes.bool.isRequired, 
  closeEditor: any,
  eventData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};
*/

export default EventEdit;
