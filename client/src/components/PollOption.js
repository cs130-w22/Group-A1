import React, { useState } from 'react';
import { ToggleButton, Button, CloseButton } from 'react-bootstrap';
import EditIcon from '../assets/edit_icon_small.svg';


function PollOption(props) {

	const [checked, setChecked] = useState(false);
	const [votes, setVotes] = useState(0);
	const [voteStatus, setVoteStatus] = useState("Vote");
	const [editStatus, setEditStatus] = useState(true);
	const [pollText, setPollText] = useState("");


	const changeVote = ()  => {
		if (checked == true) {
			setVotes(votes - 1);
			setVoteStatus("Vote");
			setChecked(false);
		}
		else {
			setVotes(votes+1);
			setVoteStatus("Remove Vote");
			setChecked(true);
		}
	}

	const saveText = () => {
		let enteredText = document.getElementById("poll-text".concat(props.keyProp)).value;
		if (enteredText != "") { 
			setPollText(enteredText);
		}
		else {
			document.getElementById("poll-option-".concat(props.keyProp)).hidden = true;
		}
		setEditStatus(false);
	}

	const handleKeyPress = e => {
		if (e.key === "Enter") {
      		saveText();
    	}
	}

	const allowEdits = () => {
		setEditStatus(true);
		document.getElementById("poll-text".concat(props.keyProp)).hidden = false;
	}

	const removeOption = () => {
		document.getElementById("poll-option-".concat(props.keyProp)).hidden = true;
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
		<div id={props.id} class="container row">
		<CloseButton onClick={removeOption}/>
		<button style={editButton} hidden={editStatus} onClick={allowEdits}><img src={EditIcon}/></button>
			<div class="col border rounded" style={optionStyle}>
    		<input key={"poll-text-".concat(props.keyProp)} id={"poll-text".concat(props.keyProp)} type="text" placeholder="Enter Poll Option" 
    			onKeyPress={handleKeyPress} hidden={!editStatus} style={editInput}/>
    		<div class="row">
    			<p class="col" hidden={editStatus}>{pollText}</p>
    			
    		</div>

    		</div>
    		<div class="col"> 
    		<ToggleButton
    			id={"vote-button".concat(props.keyProp)}
        		checked={checked}
        		onClick={changeVote} disabled={editStatus}>
    		{voteStatus}
     		</ToggleButton>
      		<p id={"votes-text".concat(props.keyProp)} hidden={editStatus}>Votes: {votes} </p>
      		</div>
      	</div>
	);
}




export default PollOption;