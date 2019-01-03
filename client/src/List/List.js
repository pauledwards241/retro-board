import React from 'react';
import { TransitionGroup } from 'react-transition-group';

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
  title,
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
    <div className={style.listContainer}>
      <header className={style.header}>{title}</header>
      <TransitionGroup appear={false} component="ul" className={style.list}>
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
      </TransitionGroup>
      <button className={style.placeholder} onClick={handleAddNote}>
        Add note...
      </button>
    </div>
  )
}

export default List;
