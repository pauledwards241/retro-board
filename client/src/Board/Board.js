import React, { Component } from 'react';
import io from 'socket.io-client';

import List from '../List/List';

import style from './Board.module.css';

const url = process.env.NODE_ENV === 'production' ? 'https://media-molecule.herokuapp.com/board' : 'http://localhost:3001/board';
const socket = io.connect(url);

const generateList = (i) => {
  return new Map([
    [(i + 1).toString(), 'note'],
    // [(i + 2).toString(), 'note'],
    // [(i + 3).toString(), 'note'],
  ]);
};

class Board extends Component {
  state = {
    list1: generateList(0),
    list2: generateList(3),
    list3: generateList(6),
    locked: {},
    selectedNoteId: null,
  };

  componentDidMount() {
    socket.on('handleAdd', ({ listId, noteId }) => {
      this.addNote(listId, noteId, false);
    });

    socket.on('handleFocus', (id) => {
      const { locked } = this.state;

      this.setState({
        locked: { ...locked, [id]: true },
      });
    });

    socket.on('handleBlur', ({ content, listId, noteId }) => {
      const { locked } = this.state;

      const reduceLocked = (acc, cur) =>
        cur !== noteId ? { ...acc, [cur]: true } : acc;

      const amended = Object.keys(locked).reduce(reduceLocked, {});

      this.setState({
        [listId]: this.state[listId].set(noteId, content),
        locked: amended,
      });
    });
  }

  addNote = (listId, noteId, isSelected) => {
    const { selectedNoteId } = this.state;

    this.setState({
      [listId]: this.state[listId].set(noteId, ''),
      selectedNoteId: isSelected ? noteId : selectedNoteId,
    });
  };

  handleAddNote = (listId) => {
    const noteId = (+new Date()).toString();

    this.addNote(listId, noteId, true);
    socket.emit('add', { listId, noteId });
  };

  handleChangeNote = (listId, noteId, content) => {
    this.setState({
      [listId]: this.state[listId].set(noteId, content),
    })
  };

  handleFocusNote = (noteId) => {
    this.setState({ selectedNoteId: noteId });
    socket.emit('focus', noteId);
  };

  handleBlurNote = (listId, noteId, content) => {
    this.setState({ selectedNoteId: null });
    socket.emit('blur', { content, listId, noteId });
  };

  render() {
    const { locked, selectedNoteId } = this.state;

    const lists = [ 'list1', 'list2', 'list3' ];

    return (
      <div className={style.wall}>
        <div className={style.board}>
          {lists.map(listId => (
            <List
              id={listId}
              key={listId}
              locked={locked}
              notes={this.state[listId]}
              onAddNote={this.handleAddNote}
              onBlurNote={this.handleBlurNote}
              onChangeNote={this.handleChangeNote}
              onFocusNote={this.handleFocusNote}
              selectedNoteId={selectedNoteId}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
