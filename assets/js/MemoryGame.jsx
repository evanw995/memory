import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Fade, Progress } from 'reactstrap';
import { Block } from './Block.jsx';

export class MemoryGame extends React.Component {

    constructor(props) {
        super(props);
        this.channel = props.channel;
        this.state = {
            blocks: [],
            gameOver: false,
            clicks: 0,
            guess: -1,
            guessTwo: -1,
            progress: 0
        }

        this.channel.join()
            .receive("ok", this.gotView.bind(this))
            .receive("error", resp => { console.log("Unable to join", resp) });

        // handleGuess must be bound in constructor
        // in order to pass down to child components (Blocks) successfully
        this.handleGuess = this.handleGuess.bind(this);
    }

    gotView(view) {
        console.log("New view", view);
        this.setState(view.game);
    }

    newMemoryGame() {
        this.channel.push("restart")
            .receive("ok", this.gotView.bind(this));
    }

    resetGuesses() {
        this.channel.push("resetGuesses")
            .receive("ok", this.gotView.bind(this));
    }

    handleGuess(num) {
        this.channel.push("guess", { num: num }) // await?
            .receive("ok", this.gotView.bind(this));
    }

    render() {
        if ((this.state.guessTwo != -1) && (this.state.guessTwo != -1)) {
            setTimeout(() => { this.resetGuesses(); }, 1000);
        }
        var newMemoryGame = this.newMemoryGame.bind(this);
        var handleGuess = this.handleGuess.bind(this);
        return (
            <div className="game">
                <br />
                <div id="restart">
                    <Button color="info" size="small" onClick={newMemoryGame}>Restart Game</Button>
                </div>
                <br />
                <div className="container">
                    <div className="row">
                        {this.state.blocks.slice(0, 4).map((item) => <Block completed={item.completed}
                            letter={item.letter} blockNum={item.index} onGuess={this.handleGuess}
                            guess={this.state.guess} guessTwo={this.state.guessTwo} key={item.index} />)}
                    </div> <br />
                    <div className="row">
                        {this.state.blocks.slice(4, 8).map((item) => <Block completed={item.completed}
                            letter={item.letter} blockNum={item.index} onGuess={this.handleGuess}
                            guess={this.state.guess} guessTwo={this.state.guessTwo} key={item.index} />)}
                    </div><br />
                    <div className="row">
                        {this.state.blocks.slice(8, 12).map((item) => <Block completed={item.completed}
                            letter={item.letter} blockNum={item.index} onGuess={this.handleGuess}
                            guess={this.state.guess} guessTwo={this.state.guessTwo} key={item.index} />)}
                    </div><br />
                    <div className="row">
                        {this.state.blocks.slice(12).map((item) => <Block completed={item.completed}
                            letter={item.letter} blockNum={item.index} onGuess={this.handleGuess}
                            guess={this.state.guess} guessTwo={this.state.guessTwo} key={item.index} />)}
                    </div>
                </div>
                <br />
                <Progress animated value={this.state.progress} />
                <br />
                <div id="score">
                    Clicks so far: {this.state.clicks}
                </div><br />
                <Fade in={this.state.gameOver}> <span id="congrats">Congrats, you did it!
                Your score is: {this.state.clicks}! </span>
                    <br /> Click restart to try again and beat your score!</Fade>
            </div>
        );
    }
}