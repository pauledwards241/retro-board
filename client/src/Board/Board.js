import React, { Component } from 'react';

import EventsManager from '../utils/EventsManager';
import StateManager from '../utils/StateManager';
import List from '../List/List';

import style from './Board.module.css';

class Board extends Component {
  state = {
    list1: new Map([]),
    list2: new Map([]),
    list3: new Map([]),
    locked: {},
    selectedNoteId: null,
  };

  eventsManager = null;
  stateManager = null;

  componentDidMount() {
    const { state } = this;

    const onNoteAdded = (listId, noteId) => {
      const updated =
        this.stateManager.addNote(state, listId, noteId);

      this.setState(updated);
    };

    const onNoteDeleted = (listId, noteId) => {
      const updated =
        this.stateManager.deleteNote(state, listId, noteId);

      this.setState(updated);
    };

    const onNoteLocked = (noteId) => {
      const updated =
        this.stateManager.lockNote(state, noteId);

      this.setState(updated);
    };

    const onNoteUnlocked = (listId, noteId, content) => {
      const updated =
        this.stateManager.unlockNote(state, listId, noteId, content);

      this.setState(updated);
    }

    this.eventsManager =
      new EventsManager(onNoteAdded, onNoteDeleted, onNoteLocked, onNoteUnlocked);
 
    this.stateManager = new StateManager();
  }

  handleAddNote = (listId) => {
    const noteId = (+new Date()).toString();

    const state =
      this.stateManager.addNote(this.state, listId, noteId, true);

    this.setState(state);
    this.eventsManager.addNote(listId, noteId);
  };

  handleDeleteNote = (listId, noteId) => {
    const state =
      this.stateManager.deleteNote(this.state, listId, noteId);
  
    this.setState(state);
    this.eventsManager.deleteNote(listId, noteId);
  };

  handleChangeNote = (listId, noteId, content) => {
    const state =
      this.stateManager.updateNote(this.state, listId, noteId, content);
  
    this.setState(state);
  };

  handleFocusNote = (noteId) => {
    const state =
      this.stateManager.toggleNoteSelection(this.state, noteId, true);

    this.setState(state);
    this.eventsManager.lockNote(noteId);
  };

  handleBlurNote = (listId, noteId, content) => {
    const state =
      this.stateManager.toggleNoteSelection(this.state, noteId, false);

    this.setState(state);
    this.eventsManager.unlockNote(listId, noteId, content);
  };

  render() {
    const { locked, selectedNoteId } = this.state;

    const lists = [
      { id: 'list1', title: 'Happy' },
      { id: 'list2', title: 'Sad' },
      { id: 'list3', title: 'Challenges' },
    ];

    return (
      <div className={style.wall}>
        <div className={style.board}>
          {lists.map(list => (
            <List
              id={list.id}
              key={list.id}
              locked={locked}
              notes={this.state[list.id]}
              onAddNote={this.handleAddNote}
              onBlurNote={this.handleBlurNote}
              onChangeNote={this.handleChangeNote}
              onDeleteNote={this.handleDeleteNote}
              onFocusNote={this.handleFocusNote}
              selectedNoteId={selectedNoteId}
              title={list.title}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Board;
