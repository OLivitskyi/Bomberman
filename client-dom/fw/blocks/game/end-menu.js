import Component from "../component.js";

/**
 * Represents the end menu component of the game.
 */
export default class EndMenu extends Component {
    /**
     * Creates an instance of EndMenu.
     * @param {Component} leaveButton - The leave button component.
     * @param {Component} restartButton - The restart button component.
     * @param {string} winner - The name of the winner.
     */
    constructor(leaveButton, restartButton, winner) {
        super("div", { id: "end-menu" });
        this.winner = winner; // TODO this is where you put the winner
        this.leaveButton = leaveButton;
        this.restartButton = restartButton;
        this.initialize();
    }

    /**
     * Initializes the end menu component.
     */
    initialize() {
        const title = new Component("h2", { id: "end-title" }, [`Game over ${this.winner} wins!`]);
        const winText = new Component("p", { id: "end-prompt" }, ["Want to go again?"]);
        const buttons = new Component("div", { id: "button-container" }, [this.restartButton, this.leaveButton]);
        this.addElement(title, winText, buttons);
    }
}