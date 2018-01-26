import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { MemoryGame } from './MemoryGame.jsx';
import { Block } from './Block.jsx';

export default function run_gamePage(root) {
  ReactDOM.render(<GamePage side={0}/>, root);
}

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: props.game
    };
  }

  render() {
    return (
      <div id="memGame">
        <MemoryGame />
      </div>
    );
  }
}
