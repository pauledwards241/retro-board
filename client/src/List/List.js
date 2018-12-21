import React, { Fragment } from 'react';
import classnames from 'classnames';

const List = ({
  id,
  locked,
  notes,
  onAddNote,
  onBlurNote,
  onChangeNote,
  onFocusNote,
}) => {
  const handleAddNote = () => {
    return onAddNote(id);
  };

  const handleFocusNote = (e) => {
    const { id: noteId } = e.target;
    return onFocusNote(noteId);
  };

  const handleBlurNote = (e) => {
    const { id: noteId, value } = e.target;
    return onBlurNote(id, noteId, value);
  };

  const handleChangeNote = (e) => {
    const { id: noteId, value } = e.target;
    return onChangeNote(id, noteId, value);
  };

  return (
    <Fragment>
      <ul>
        {Array.from(notes).map(([key, value]) => (
          <li className={classnames('item', { 'item--disabled': !!locked[key] })} key={key}>
            <textarea
              id={key}
              onBlur={handleBlurNote}
              onChange={handleChangeNote}
              onFocus={handleFocusNote}
              value={value}
            ></textarea>
          </li>
        ))}
      </ul>
      <button onClick={handleAddNote}>Add</button>
    </Fragment>
  )
}

export default List;
