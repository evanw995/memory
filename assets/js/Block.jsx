import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export class Block extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if ((!this.props.completed) && (this.props.guessTwo == -1)) {
            this.props.onGuess(this.props.blockNum);
        }
    }

    displayLetter() {
        if (this.props.completed) {
            return this.props.letter + '✔';
        } else if (this.isGuess()) {
            return this.props.letter;
        } else {
            return '?';
        }
    }

    isGuess() {
        return ((this.props.blockNum == this.props.guess) ||
            (this.props.blockNum == this.props.guessTwo));
    }

    displayColor() {
        if (this.props.completed) {
            return "success"; // Completed block: green
        } else if ((this.props.guessTwo != -1) && this.isGuess()) {
            return "danger"; // Wrong guess: red
        } else if (this.isGuess()) {
            return "primary"; // Selected first block: blue
        } else {
            return "secondary"; // Default: grey
        }
    }

    render() {
        var handleClick = this.handleClick.bind(this);
        var display = this.displayLetter();
        var color = this.displayColor();
        return (
            <div className="col">
                <Button size="lg" color={color} onClick={handleClick}>{display}</Button>
            </div>
        );
    }
}