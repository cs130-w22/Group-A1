/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import { LinkContainer } from 'react-router-bootstrap';
import { getUser } from '../api/users';
import { TITLE } from '../assets/constants';
import { UserContext } from '../utils/context';
import EventList from './EventList';
import EventSection from './EventSection';
import InviteList from './InviteList';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    document.title = `${TITLE}`;
  }, []);
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
              <h2 className="mb-0">
                Hi
                {' '}
                <span className="fw-bold  text-primary">
                  {user.username}
                  !
                </span>
              </h2>
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
