import io from 'socket.io-client';

export default class EventsManager {
  constructor(
    onNoteAdded,
    onNoteDeleted,
    onNoteLocked,
    onNoteUnlocked,
  ) {
    const url = process.env.NODE_ENV === 'production' ?
      'https://media-molecule.herokuapp.com/board' :
      'http://localhost:3001/board';

    this.socket = io(url);

    this.socket.on('on note added', onNoteAdded);
    this.socket.on('on note deleted', onNoteDeleted);
    this.socket.on('on note locked', onNoteLocked);
    this.socket.on('on note unlocked', onNoteUnlocked);
  }

  addNote(listId, noteId) {
    this.socket.emit('note added', listId, noteId);
  }

  deleteNote(listId, noteId) {
    this.socket.emit('note deleted', listId, noteId);
  }

  lockNote(noteId) {
    this.socket.emit('note locked', noteId);
  }

  unlockNote(listId, noteId, content) {
    this.socket.emit('note unlocked', listId, noteId, content);
  }
}
