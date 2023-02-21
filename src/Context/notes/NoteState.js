import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const noteInitial = [];
  const [notes, setNotes] = useState(noteInitial);
  
  
  //get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'auth-Token'  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1MjY1N2ZhMTgxMTE5ZWUzMzM0NWNjIn0sImlhdCI6MTY2NjM0NjI4Mn0.HitsmbPb3Oreev4XJ2rGuFM_1M8mDlqJJf8AoRKFrHk"
     }
    });
    const json = await response.json()
    setNotes(json)
  };


  //add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'auth-Token'  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1MjY1N2ZhMTgxMTE5ZWUzMzM0NWNjIn0sImlhdCI6MTY2NjM0NjI4Mn0.HitsmbPb3Oreev4XJ2rGuFM_1M8mDlqJJf8AoRKFrHk"
     },  
      body: JSON.stringify({title, description, tag})
    });
    
    const note = await response.json();
    setNotes(notes.concat(note));
  };

  //delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'auth-Token'  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1MjY1N2ZhMTgxMTE5ZWUzMzM0NWNjIn0sImlhdCI6MTY2NjM0NjI4Mn0.HitsmbPb3Oreev4XJ2rGuFM_1M8mDlqJJf8AoRKFrHk"
     }
    });
    const json = response.json();
    console.log(json);
    const newNotes = notes.filter((note)=>{return note._id!==id})
    setNotes(newNotes);
  };

  //edit a note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'auth-Token'  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1MjY1N2ZhMTgxMTE5ZWUzMzM0NWNjIn0sImlhdCI6MTY2NjM0NjI4Mn0.HitsmbPb3Oreev4XJ2rGuFM_1M8mDlqJJf8AoRKFrHk"
     },  
      body: JSON.stringify({title, description, tag})
    });
    const json = await response.json();
    console.log(json);

    let newNote = JSON.parse(JSON.stringify(notes));//make  a copy
    //edit in client side
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id){
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;        
        break;
      }
    }
    setNotes(newNote);
  };



  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
