import React, { useState } from 'react';
import {Card, ListGroup, Button} from 'react-bootstrap';
import PollOption from './PollOption';

function Poll() {

	const [optionList, setOptionList] = useState([<PollOption key={0} keyProp={0} id="poll-option-0"/>,
		<PollOption key={1} keyProp={1} id="poll-option-1"/>, <PollOption key={2} keyProp={2} id="poll-option-2"/>]);

	const addOption = event => {
		let id = "poll-option-".concat(optionList.length);
    	setOptionList(optionList.concat(<PollOption key={optionList.length} keyProp={optionList.length} id={id}/>));
  	};



	return (
		<Card class="border" >
		<h1>Poll Question</h1>
			{optionList}
			<Button onClick={addOption}>add option</Button>
  		</Card>
  		
	); 
}

export default Poll;

