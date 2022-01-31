import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import { getUser } from '../api/users';
import { UserContext } from '../utils/userContext';

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
          <h2 className="fs-3">
            Hi
            {' '}
            <span className="fw-bold">
              {user.username}
              !
            </span>
          </h2>
          { loading && (
          <Watch
            heigth="100"
            width="100"
            color="grey"
            ariaLabel="loading"
          />
          ) }
        </div>
      ) : <div>placeholder</div>}
    </div>
  );
}

export default Home;
