import React, { useState } from 'react';
import { ToggleButton, Button, CloseButton } from 'react-bootstrap';
import EditIcon from '../assets/edit_icon_small.svg';


function PollOption(props) {

	const optionObj = JSON.parse(props.opt)
	const [option, setOption] = useState(optionObj);
	const [voteStatus, setVoteStatus] = useState("Vote");
	const [checked, setChecked] = useState(false)
	const [editMode, setEditMode] = useState(props.editMode);
	console.log(editMode)
	const [votes, setVotes] = useState(0)


	const changeVote = ()  => {
		if (checked == true) {
			setVotes(votes - 1);
			setVoteStatus("Vote");
			setChecked(false);
		}
		else {
			setVotes(votes+1)
			setVoteStatus("Remove Vote")
			setChecked(true)
		}
	}

	const saveText = () => {
		let enteredText = document.getElementById("poll-text".concat(option._id)).value
		let updatedOpt = option
		updatedOpt.text = enteredText
		setOption(updatedOpt)
		
		savePollOption(enteredText)
		setEditMode(false)
	}

	const savePollOption = (text) => {
		const saveURL = 'http://localhost:5000/poll/addoption'
		const saveRequestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({optionID: option._id, pollID: props.opt.poll, text: text, votes: votes, voters: ['user'] })
		}
		fetch(saveURL, saveRequestOptions)
			.then((ret) => { console.log("Saved")
			}).catch((error) => {console.log(error)})
	}


	const handleKeyPress = e => {
		if (e.key === "Enter") {
      		saveText();
    	}
	}

	const allowEdits = () => {
		setEditMode(true);
		document.getElementById("poll-text".concat(option._id)).hidden = false;	
	}

	const removeOption = () => {
		const deleteOptions = {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ optionID: option._id, pollID: props.opt.poll })
		}
		fetch("http://localhost:5000/poll/deletethisoption", deleteOptions)
			.then(response => response.json())
			.then(data => {
				props.cb(data)
			})
			.catch(err => console.log(err))
	}

	const optionStyle = {
		height: '100px',
		lineHeight: '100px',
		textAlign: 'center',
		fontSize: '30px'
	}

	const editInput = {
		border: 'none',
		width: '100%',
		height: '100%',
		fontSize: '30px',
		textAlign: 'center',
		lineHeight: '100px'

	}

	const editButton = {
		    boxSizing: 'content-box',
    		width: '1em',
    		height: '1em',
    		color: '#000',
    		background: 'transparent',
   			border: '0',
    		borderRadius: '0.25rem',
    		opacity: '0.5'
	}

	return (
		<div id={option._id} class="container row">
		<CloseButton onClick={removeOption}/>
		<button style={editButton} hidden={editMode} onClick={allowEdits}><img src={EditIcon}/></button>
			<div class="col border rounded" style={optionStyle}>
    		<input key={"poll-text-".concat(option._id)} id={"poll-text".concat(option._id)} type="text" placeholder="Enter Poll Option" 
    			onKeyPress={handleKeyPress} hidden={!editMode} style={editInput}/>
    		<div class="row">
    			<p class="col" hidden={editMode}>{option.text}</p>
    			
    		</div>

    		</div>
    		<div class="col"> 
    		<ToggleButton
    			id={"vote-button".concat(option._id)}
        		checked={checked}
        		onClick={changeVote} disabled={editMode}>
    		{voteStatus}
     		</ToggleButton>
      		<p id={"votes-text".concat(option._id)} hidden={editMode}>Votes: {votes} </p>
      		</div>
      	</div>
	);
}




export default PollOption;