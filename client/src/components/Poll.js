import React, { useState, useEffect } from 'react';
import {Card, Button} from 'react-bootstrap';
//import { ThemeProvider } from 'styled-components';
import PollOption from './PollOption';

function Poll(props) {


	const [options, setOptions] = useState([]); //includes edit property for poll Option for now
	const [editMode, setEditMode] = useState(false);
	const fetchURL = "http://localhost:5000/poll/getoptions?pollID=" + props.ref_id
	const optionPrototype = Object.create({
		opt: {},
		editOn: true
	})


	const deleteCallback = (deleted) => {
		const updatedOptions = options.filter(option => option.opt._id !== deleted._id)
		setOptions(updatedOptions)
	}

	async function fetchOptions() {
			let response = await fetch(fetchURL)
			let data = await response.json()
			const existingOptions = Array.from(options)
			for (let i = 0; i < data.length; i++) {
				const newOption = Object.create(optionPrototype)
				newOption.opt = data[i]
				newOption.editOn = false
				existingOptions.push(newOption)
			}
		setOptions(existingOptions);
	}

	useEffect(() => {
		fetchOptions()
	}, [fetchURL, props.ref_ids])

	const createNewOption =  async () => {
		const createURL = 'http://localhost:5000/poll/addoption'
		const createOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ optionID: "", pollID: props.ref_id, text: "", votes: 0, voters: [] })
		}
		fetch(createURL, createOptions)
			.then((response) => response.json())
			.then((newOption) => {
				const updatedOptions = Array.from(options)
				let optionListAdd = Object.create(optionPrototype)
				optionListAdd.opt = newOption
				optionListAdd.editOn = true
				updatedOptions.push(optionListAdd)
				setOptions(updatedOptions)
			}).catch((error) => {console.log(error)})
  	}

  	const allowEdits = () => {
  		setEditMode(true)
  	}

  	const savePoll = () => {
  		setEditMode(false)
  		/*
  		const saveRequestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ max_option_id: optionList.length, votes_allowed: 2, add_option_enabled: true, curr_id: pollID })
		}
		fetch('http://localhost:5000/poll', saveRequestOptions)
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => )
		*/
  	}

	return (
		<Card id={props.ref_id} class="border">
		<h1>One Poll</h1>
			{ options.map((option, i) => <PollOption key={i} keyProp={i} opt={JSON.stringify(option.opt)} editMode={option.editOn} cb={deleteCallback}/>) }
			<Button onClick={createNewOption}>add option</Button>
			<Button onClick={savePoll} hidden={!editMode}>save poll</Button>
			<Button onClick={allowEdits} hidden={editMode}>edit poll</Button>
  		</Card>
  		
	); 
}

export default Poll;

