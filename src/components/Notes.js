import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import noteContext from "../context/notes/noteContext"
import AddNote from './AddNote';
import NoteItem from './NoteItem';

const Notes = (props) => {
	const context = useContext(noteContext);
	const { notes, getNotes, editNote } = context;
	let history = useHistory();
	useEffect(() => {
		if(localStorage.getItem('token')){
			getNotes();
		}
		else{
			history.push('/login');
		}
		// eslint-disable-next-line
	}, []);
	
	const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
	const ref = useRef(null);
	const refClose = useRef(null);

	const handleClick = (e) => {
		editNote(note.id, note.etitle, note.edescription, note.etag);
		refClose.current.click();
		props.showAlert("Updated Sucessfully", "success");
	}

	const onChange = (e) => {
		setNote({ ...note, [e.target.name]: e.target.value });
	}

	const updateNote = (currentNote) => {
		ref.current.click();
		setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
	}

	return (
		<>
			<AddNote showAlert={props.showAlert}/>
			<button ref={ref} type="button" className="btn btn-dark d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">

			</button>

			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form className="my-3">
								<div className="mb-3">
									<label htmlFor="etitle" className="form-label">Title</label>
									<input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} minLength= {5} required aria-describedby="emailHelp" onChange={onChange} />
								</div>
								<div className="mb-3">
									<label htmlFor="edescription" className="form-label">Description</label>
									<input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} minLength= {5} required onChange={onChange} />
								</div>
								<div className="mb-3">
									<label htmlFor="etag" className="form-label">Tag</label>
									<input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength= {5} required />
								</div>
							</form>
						</div>
						<div className="modal-footer">
							<button type="button" ref={refClose} className="btn btn-danger" data-bs-dismiss="modal">Close</button>
							<button disabled= {note.etitle.length < 5 || note.edescription.length < 5} type="button" onClick={handleClick} className="btn btn-dark">Update Note</button>
						</div>
					</div>
				</div>
			</div>
			<div className="row my-3">
				<h1>
					Your Notes
				</h1>
				<div className='container row mx-2'>
					{notes.length === 0 && 'No notes to display'}
					{notes.map((note) => {
						return <NoteItem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
					})}
				</div>
			</div>
		</>
	)
}

export default Notes;