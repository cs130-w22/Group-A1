/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import { LinkContainer } from 'react-router-bootstrap';
import { getUser } from '../api/users';
import { UserContext } from '../utils/context';
import EventList from './EventList';
import InviteList from './InviteList';
import Gcalender from './Gcalender';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    if (user?.userId) {
      getUser(user.userId)
        .then((res) => {
          if (res.data) setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          console.error(err);
          setUser(null);
        });
    } else {
      setLoading(false);
      setData(null);
    }
  }, [user, setUser]);

  return (
    <div>
      {user?.username ? (
        <div>
          <Row>
            <Col xs={7}>
              <h2 className="fs-3">
                Hi <span className="fw-bold">{user.username}!</span>
              </h2>{' '}
              <LinkContainer to="/event/create">
                <Button variant="outline-primary" className="ms-1 fw-bold">
                  create event +
                </Button>
              </LinkContainer>
              <EventList props={user?.username} />
            </Col>
            <Col>
              <InviteList />
            </Col>
          </Row>
          {loading && (
            <Watch heigth="100" width="100" color="grey" ariaLabel="loading" />
          )}
        </div>
      ) : (
        <div>placeholder</div>
      )}
    </div>
  );
}

export default Home;