import React, { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {
	const host = "http://localhost:5000";
	const [notes, setNotes] = useState([]);

	const getNotes = async () => {
		const response = await fetch(`${host}/api/notes/fetchallnotes`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token')
			}
		});
		const notes = await response.json()
		setNotes(notes);
	}

	const addNote = async (title, description, tag) => {
		const response = await fetch(`${host}/api/notes/addnote`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token')
			},
			body: JSON.stringify({ title, description, tag })
		});
		const note = await response.json()
		setNotes(notes.concat(note));
	}

	const editNote = async (id, title, description, tag) => {
		const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token')
			},
			body: JSON.stringify({ title, description, tag })
		});
		// eslint-disable-next-line
		const json = await response.json();

		let newNotes = JSON.parse(JSON.stringify(notes));
		for (let index = 0; index < newNotes.length; index++) {
			const element = newNotes[index];
			if (element._id === id) {
				element.title = title;
				element.description = description;
				element.tag = tag;
				break;
			}
		}
		setNotes(newNotes);
	}

	const deleteNote = async (id) => {
		const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'auth-token': localStorage.getItem('token')
			}
		});
		// eslint-disable-next-line
		const json = await response.json();
		const newNotes = notes.filter((note) => { return note._id !== id });
		setNotes(newNotes);
	}

	return (
		<NoteContext.Provider value={{ notes, addNote, editNote, deleteNote, getNotes }}>
			{props.children}
		</NoteContext.Provider>
	)

}

export default NoteState;