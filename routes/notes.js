const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Note = require("../models/Note")
const { body, validationResult } = require('express-validator');

// ROUTE:1 get all notes using GET: "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
   try {
      const notes = await Note.find({ user: req.user.id });
      res.json(notes)
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})

// ROUTE:2 add a new note using POST: "/api/notes/addnotes"
router.post('/addnote', fetchuser, [

   body('title', "enter a valid title").isLength({ min: 3 }),
   body('description', "Description must be atleast 5 character").isLength({ min: 5 }),
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
      const savedNote = await note.save()
      res.json(savedNote)
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})


//ROUTER:3 Update a note PUT:/api/notes/updatenote
router.put('/updatenote/:id', fetchuser, fetchuser, [], async (req, res) => {
   const { title, description, tag } = req.body;
   try {

      //create a newNote object

      const newNote = {};
      if (title) { newNote.title = title }
      if (title) { newNote.description = description }
      if (title) { newNote.tag = tag }

      //Find note to be updated

      let note = await Note.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("Not Allowed")
      }

      note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
      res.json({ note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})

//ROUTER:4 Delete a note DELETE:/api/notes/deletenote

router.delete('/deletenote/:id', fetchuser, fetchuser, [], async (req, res) => {

   try {

      //Find note to be deleted
      let note = await Note.findById(req.params.id);
      if (!note) { return res.status(404).send("Not Found") }

      //Allow deletion only if user owns this note
      if (note.user.toString() !== req.user.id) {
         return res.status(401).send("Not Allowed")
      }

      note = await Note.findByIdAndDelete(req.params.id)
      res.json({ "Success": "Note has been deleted", note: note });
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})
module.exports = router