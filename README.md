## Sprint retrospective board

An attempt at creating an online, interactive sprint retrospective board. Post-it notes can be added to and removed from the following three columns on a chalkboard:

* Happy - *What went well*
* Sad - *What didn't go well*
* Challenges - *Any challenges encountered*

Other users are notified in real time when notes have been added, removed and also when one is being edited. The app is fully keyboard accessible.

I wanted to create an attractive and fun representation of a real-life event at work. Also, who doesn't love a good chalkboard?! :-)

A running version of the app can be seen here [Retrospective board](https://media-molecule.herokuapp.com).

It can also be run locally after the repository has been cloned and dependencies installed by executing `yarn dev`. It expects a global installation of `yarn` and `nodemon`.

## Architecture

The following components have been created:

`<Board />` - This is the top-level custom component. It handles rendering the three lists and any state updates.

`<List />` - This represents one of the columns and handles the addition of new notes.

`<Note />` - Represents a Post-it note. It handles editing and deleting notes. All state change requests are propagated back up to the `<Board />` component.

`<Mask />` - Covers (locks) the `<Note />` component when another user is editing it.

The following utility modules were also created:

`EventsManager.js` - This encapsulates all of the socket behaviour. It accepts event callbacks from the `<Board />` component.

`StateManager.js` - This module has a number of methods which accept the current state and changes from event handlers in the `<Board />` component. State is updated in an immutable fashion and returned back to the React component.

## Additional libraries

[Create React App](https://github.com/facebook/create-react-app) - Used to quickly bootstrap a React application using webpack as a development server. A Node.js/Express application was added to handle receiving and broadcasting events.

[Socket.IO](https://github.com/socketio/socket.io) / [Socket.IO client](https://github.com/socketio/socket.io-client) - Handles real time updates between users.

[React transition group](https://github.com/reactjs/react-transition-group) - Used for transitions when adding or removing notes.

[Classnames](https://github.com/JedWatson/classnames) - Allows a simpler notation when using conditional classes.

## Limitations and further developments

### Data persistence

Currently data is not persisted on the server. If one user was to add some notes in their session and another user was to join afterwards, the new user would not see existing changes. However, they would see any further changes. This would be the next thing I would implement.

### Error handling

...Doesn't really exist. There is no resilience if an event fails to be sent to or from the server. Again, this is where persisting data on the server would help to ensure data is not lost if a client loses their network connection.

### One instance only

Currently, only one instance of the board can be run. This could be resolved by having a module on the server managing multiple boards. This could then broadcast available boards at the point the client connects and also allow a new one to be created. Any pushes from the client would then provide the board ID along with any other data.

### State management

The app uses local state in the `<Board />` component. If the app was to become more complex e.g. multiple boards, I would implement a state management library such as Redux.

### Responsiveness

Hmm... It looks OK on a small screen and a large screen, but there is a dark place in between where it doesn't look great. This is something that could be refined with some more time and experimentation.

### Browser support

This has only really been tested with the latest versions of the following browsers:

* Chrome (desktop)
* Chrome (mobile)
* Safari (mobile)

### Unit tests

There are none :-( With more time, I would add full coverage of components and utilities.
