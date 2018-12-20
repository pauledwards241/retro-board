import React, { Component } from 'react';
import io from 'socket.io-client';

import logo from './logo.svg';
import './App.css';

const socket = io.connect('http://localhost:8080/board');

class App extends Component {
  async componentDidMount() {
    socket.on('news', (data) => {
      console.log('news');
      socket.emit('my other event', { my: 'data' });
    });
  }

  handleButtonClick = () => {
    socket.emit('my other event', { payload: 'button click' });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <button onClick={this.handleButtonClick}>Emit</button>
      </div>
    );
  }
}

export default App;
