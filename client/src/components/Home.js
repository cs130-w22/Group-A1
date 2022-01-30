import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getUser } from "../api/users";
import { Navigation } from "../Navigation";
import { UserContext } from "../utils/userContext";
import { Watch } from 'react-loader-spinner'

function Home() {
    const userId = useContext(UserContext);
    const [username, setUsername] = useState();
    const [loading, setLoading] = useState();
    useEffect(() => {
        setLoading(true);
        if (userId) {
            getUser(userId)
                .then((res) => {
                    if (res.data.username) setUsername(res.data.username);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            setLoading(false);
            setUsername(null);
        }
    }, [setUsername, userId]);


    if (loading) return (
        <Watch
            heigth="100"
            width="100"
            color='grey'
            ariaLabel='loading'
        />
    )
    return (
        <Container>
            {username ? <div>Hi, {username}</div> : <div>placeholder</div>}
        </Container>
    )
}

export default Home;