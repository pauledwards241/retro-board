import React, { Component } from 'react';
import io from 'socket.io-client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './App.css';

const socket = io.connect('http://localhost:8080/board');

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends Component {
  state = {
    dragItem: null,
    items: [
      { content: 'Item 1', id: 1 },
      { content: 'Item 2', id: 2 },
      { content: 'Item 3', id: 3 }
    ],
  };

  async componentDidMount() {
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

  render() {
    const { dragItem } = this.state;

    return (
      <React.Fragment>
      {dragItem && <div className="item" style={{ position: 'absolute', left: dragItem.x, top: dragItem.y }}></div>}
      <DragDropContext onDragEnd={this.onDragEnd} onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
          >
            {this.state.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <li
                    className="item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item.content}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </React.Fragment>
    );
  }
}

export default App;
