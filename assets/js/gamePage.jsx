import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import { MemoryGame } from './MemoryGame.jsx';
import { Block } from './Block.jsx';

export default function run_gamePage(root, channel) {
  ReactDOM.render(<GamePage channel={channel}/>, root);
}

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: props.channel,
    };
  }

  render() {
    return (
      <div id="memGame">
        <MemoryGame channel={this.props.channel}/>
      </div>
    );
  }
}
