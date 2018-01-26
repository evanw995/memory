import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Fade, Progress } from 'reactstrap';
import { Block } from './Block.jsx';

function generateBlocks() {
    var chars = 'AABBCCDDEEFFGGHH'.split('');
    var blocks = [];
    for (var i = 0; i < 16; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        var randomLetter = chars[randomIndex];
        blocks[i] = { index: i, letter: randomLetter, completed: false };
        chars.splice(randomIndex, 1);
    }
    return blocks;
}

export class MemoryGame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blocks: generateBlocks(),
            gameOver: false,
            clicks: 0,
            guess: -1,
            guessTwo: -1,
            progress: 0
        }
        // handleGuess must be bound in constructor
        // in order to pass down to child components (Blocks) successfully
        this.handleGuess = this.handleGuess.bind(this);
    }

    addClick() {
        this.setState({ clicks: this.state.clicks + 1 });
    }

    newMemoryGame() {
        this.setState({
            blocks: generateBlocks(),
            gameOver: false,
            clicks: 0,
            guess: -1,
            guessTwo: -1,
            progress: 0
        });
    }

    resetGuesses() {
        this.setState({ guess: -1, guessTwo: -1 });
    }

    handleGuess(num) {
        if ((this.state.guessTwo != -1) || this.state.gameOver) {
            return;
        }
        console.log("handleGuess parent function is being called with key: " + num);
        if (this.state.guess == -1) { // First guess
            this.setState({ guess: num });
            this.addClick();
        } else if (this.state.guess == num) { // Annoying user clicking same square case!
            return;
        } else { // Second guess
            this.addClick();
            this.setState({ guessTwo: num });
            if (this.state.blocks[num].letter == this.state.blocks[this.state.guess].letter) {
                var updatedArray = this.state.blocks.slice();
                updatedArray[num].completed = true;
                updatedArray[this.state.guess].completed = true;
                this.setState({ blocks: updatedArray, progress: this.state.progress + 12.5 });
                this.resetGuesses();
                this.checkGameOver();
            } else {
                setTimeout(() => { this.resetGuesses(); }, 1000);
            }
        }
    }

    checkGameOver() {
        for (var i = 0; i < this.state.blocks.length; i++) {
            if (!this.state.blocks[i].completed) {
                return;
            }
        }
        this.setState({ gameOver: true });
        return;
    }

    render() {
        var addClick = this.addClick.bind(this);
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