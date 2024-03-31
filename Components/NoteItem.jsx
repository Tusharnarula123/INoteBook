import React, { useContext } from 'react'
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';
import NoteContext from '../Context/NoteContext';
const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note,updateNote} = props
  return (
    <div className='col-md-3'>
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title ">{note.title}</h5>
            <AiFillDelete className='mx-2' id='icon' onClick={() => { deleteNote(note._id) ;  props.showAlert("Deleted Successfully", "success")}} />
            <AiOutlineEdit className='mx-2' id='icon' onClick={() => {updateNote(note)}}/>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  )
}

export default NoteItem
