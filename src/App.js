import React from 'react';
import './App.css';
import Home from './components/Home';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Home />
    );
  }
}

export default App;
