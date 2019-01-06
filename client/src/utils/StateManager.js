const removeObjectEntry = (obj, id) =>
  Object.keys(obj).reduce((acc, cur) => (
    cur !== id ? { ...acc, [cur]: true } : acc
  ), {});

export default class StateManager {
  addNote(state, listId, noteId, isSelected) {
    const { [listId]: list, selectedNoteId } = state;

    return {
      ...state,
      [listId]: list.set(noteId, ''),
      selectedNoteId: isSelected ? noteId : selectedNoteId,
    };
  }

  deleteNote(state, listId, noteId) {
    const { [listId]: list, locked } = state;
    
    list.delete(noteId);

    return {
      ...state,
      [listId]: new Map(list),
      locked: removeObjectEntry(locked, noteId),
    }
  }

  lockNote(state, noteId) {
    const { locked } = state;

    return {
      ...state,
      locked: { ...locked, [noteId]: true },
    };
  }

  toggleNoteSelection(state, noteId, isSelected) {
    return {
      ...state,
      selectedNoteId: isSelected ? noteId : null,
    };
  }

  unlockNote(state, listId, noteId, content) {
    const { [listId]: list, locked } = state;

    return {
      [listId]: list.set(noteId, content),
      locked: removeObjectEntry(locked, noteId),
    };
  }

  updateNote(state, listId, noteId, content) {
    const { [listId]: list } = state;

    return {
      [listId]: list.set(noteId, content),
    };
  }
}
