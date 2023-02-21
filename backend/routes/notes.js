const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//route 1 : get all the notes : (because we have to take header from the url)GET "/api/notes/fetchallnotes"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error Occured!");
  }
});

//route 2 : add a new notes : POST "/api/notes/addnote", login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "Enter valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error Occured!");
    }
  }
);

//route 3 : update note using : (for updation we use PUT)"/api/auth/updatenote" login require
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //create new note object
    const newNote = {};

    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!");
    }

    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed!");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); //new:true = updated if new content arrived
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error Occured!");
  }
});

//route 4 : Delete note : DELETE, login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //Find the note to be delete
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found!");
    }

    //allowed validated user for deletion
    if (note.user.toString() != req.user.id) {
      return res.status(401).send("Not Allowed!");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ status: "Note deleted successfully ... " });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error Occured!");
  }
});

module.exports = router;
