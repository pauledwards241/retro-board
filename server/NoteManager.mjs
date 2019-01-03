export default class NoteManager {
  constructor() {
    this.locked = {};
  }

  lockNote(noteId) {
    this.locked[noteId] = true;
  }
}
