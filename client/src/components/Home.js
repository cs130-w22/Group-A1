import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import { getUser } from '../api/users';
import { UserContext } from '../utils/userContext';

function Home() {
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState();
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    if (user) {
      getUser(user)
        .then((res) => {
          if (res.data.username) setUsername(res.data.username);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setUsername(null);
    }
  }, [setUsername, user]);

  if (loading) {
    return (
      <Watch
        heigth="100"
        width="100"
        color="grey"
        ariaLabel="loading"
      />
    );
  }
  return (
    <Container>
      {username ? (
        <div>
          Hi,
          {' '}
          {username}
        </div>
      ) : <div>placeholder</div>}
    </Container>
  );
}

export default Home;
