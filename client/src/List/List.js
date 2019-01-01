import React from 'react';

import Note from '../Note/Note';

import style from './List.module.css';

const List = ({
  id,
  locked,
  notes,
  onAddNote,
  onBlurNote,
  onChangeNote,
  onFocusNote,
  selectedNoteId,
}) => {
  const handleAddNote = () => {
    onAddNote(id);
  };

  const handleBlurNote = (noteId, value) => {
    onBlurNote(id, noteId, value);
  };

  const handleChangeNote = (noteId, value) => {
    onChangeNote(id, noteId, value);
  };

  return (
    <div>
      <ul className={style.list}>
        {Array.from(notes).map(([key, value]) => (
          <Note
            id={key}  
            isLocked={!!locked[key]}
            isSelected={key === selectedNoteId}
            key={key}
            onBlur={handleBlurNote}
            onChange={handleChangeNote}
            onFocus={onFocusNote}
            value={value}
          />
        ))}
      </ul>
      <button className={style.placeholder} onClick={handleAddNote}>
        Add new note
      </button>
    </div>
  )
}

export default List;
