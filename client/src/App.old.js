import React, { Component } from 'react';
import io from 'socket.io-client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './App.css';

const socket = io.connect('http://localhost:3001/board');

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends Component {
  state = {
    dragItem: null,
    inProgress: new Set(),
    // items: [
    //   { content: 'Item 1', id: 1 },
    //   { content: 'Item 2', id: 2 },
    //   { content: 'Item 3', id: 3 }
    // ],
    items: new Map([[ 1, 'Item 1' ], [ 2, 'Item 2' ], [ 3, 'Item 3' ]]),
  };

  componentDidMount() {
    const { inProgress, items } = this.state;

    socket.on('handleAdd', (note) => {
      this.setState({
        items: items.concat(note),
      });
    });

    socket.on('handleBlur', (id) => {
      this.setState({
        inProgress: inProgress.delete(id),
      });
    });

    socket.on('handleFocus', (id) => {
      this.setState({
        inProgress: inProgress.add(id),
      });
    });

    socket.on('handleDrag', ({ x, y }) => {
      this.setState({
        dragItem: { x, y },
      })
    });

    socket.on('handleDragEnd', () => {
      this.setState({
        dragItem: null,
      })
    });
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    window.removeEventListener('mousemove', this.emitCoords);
    socket.emit('dragEnd');

    this.setState({
      items,
    });
  };

  onDragStart = (e) => {
    window.addEventListener('mousemove', this.emitCoords);
  };
  
  emitCoords = ({ offsetX: x, offsetY: y }) => {
    // Throttle
    socket.emit('drag', { x, y });
  };

  handleAddNote = () => {
    const { items } = this.state;

    const note = {
      content: '',
      id: items.length + 1,
    };

    this.setState({
      items: items.concat(note) ,
    });

    socket.emit('add', note);
  };

  handleContentChange = (e) => {


    this.setState({
      items: this.state.items.set(+e.target.id, e.target.value),
    })

  };

  handleFocusNote = (e) => {
    socket.emit('focus', e.target.id);
  };

  handleBlurNote = (e) => {
    socket.emit('blur', e.target.id);
  }

  render() {
    const { dragItem, inProgress } = this.state;

    return (
      <React.Fragment>
      {dragItem && <div className="item" style={{ position: 'absolute', left: dragItem.x, top: dragItem.y }}></div>}
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
          >
            {Array.from(this.state.items).map(([key, value], index) => (
              <Draggable key={key} draggableId={key} index={index}>
                {(provided, snapshot) => (
                  <li
                    className="item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <textarea
                      id={key}
                      onBlur={this.handleBlurNote}
                      onChange={this.handleContentChange}
                      onFocus={this.handleFocusNote}
                      value={inProgress.has(key) ? '....' : value}
                    ></textarea>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    <button onClick={this.handleAddNote}>Add</button>
    </React.Fragment>
    );
  }
}

export default App;
