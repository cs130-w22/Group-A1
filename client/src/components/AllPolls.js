import React, { useState, useEffect } from 'react';
import {Card, ListGroup, Button} from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import Poll from './Poll';

function AllPolls() {

	const [pollList, setPollList] = useState([]);


	useEffect(() => {
		fetch('http://localhost:5000/poll')
			.then((response) => response.json())
			.then((data) => {
				console.log(data)
				let allPolls = []
				for (let i = 0; i < data.length; i++) {
					allPolls[i] = <Poll key={i} ref_id={data[i]._id} thisPoll={data[i]}/>
				}
				setPollList(allPolls)
				
			})
			.catch(error => console.log(error))
	}, [])

	const createNewPoll = () => {
		const createPollRequest = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({max_option_id: 0, votes_allowed: 2, add_option_enabled: true})
		}
		fetch('http://localhost:5000/poll/create', createPollRequest)
			.then((response) => response.json())
			.then((createdPoll) => {
    			setPollList((pollList) => [pollList, <Poll key={pollList.length} ref_id={createdPoll._id}/>])
    		})
			.catch((error) => setPollList(<p>couldn't create</p>))			
  	}

	return (
		<div>
			{pollList}
			<Button onClick={createNewPoll}>add Poll</Button>
  		</div>
	); 
}

export default AllPolls;