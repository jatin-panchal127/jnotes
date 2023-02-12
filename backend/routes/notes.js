const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

router.get('/fetchallnotes', fetchuser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		res.json(notes);
	}
	catch (error) {
		console.error(error.message);
		res.status(500).send('Internal server error');
	}

})

router.post('/addnote', fetchuser, [
	body('title', 'Enter a valid title').isLength({ min: 3 }),
	body('description', 'Enter a description of atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
	try {
		const { title, description, tag } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const note = new Note({
			title, description, tag, user: req.user.id
		})
		const savedNote = await note.save();
		res.json(savedNote);
	}
	catch (error) {
		console.error(error.message);
		res.status(500).send('Internal server error');
	}
})

router.put('/updatenote/:id', fetchuser, async (req, res) => {
	const { title, description, tag } = req.body;
	try {

		const newNote = {};
		if (title) {
			newNote.title = title
		}
		if (description) {
			newNote.description = description;
		}
		if (tag) {
			newNote.tag = tag;
		}

		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).send("Note Not Found");
		}

		if (note.user.toString() !== req.user.id) {
			return res.status(401).send("Access denied");
		}

		note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
		res.json({ note });
	}
	catch (error) {
		console.error(error.message);
		res.status(500).send('Internal server error');
	}
})

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
	try {
		let note = await Note.findById(req.params.id);
		if (!note) {
			return res.status(404).send("Note Not Found");
		}

		if (note.user.toString() !== req.user.id) {
			return res.status(401).send("Access denied");
		}

		note = await Note.findByIdAndDelete(req.params.id);
		res.json({ "success": "Note deleted", note: note });
	}
	catch (error) {
		console.error(error.message);
		res.status(500).send('Internal server error');
	}
})

module.exports = router;