import Framework from "../runner/framework.js"
import Component from "./component.js"
import BootMenu from "./startup.js"
import WS from "../ws/ws-conn.js"
import Game from "./game/game.js"
import Chat from "./chat.js"
import WaitingRoom from "./lobby.js"
import EndMenu from "./game/end-menu.js"

export default class GameManager {
    constructor() {
        this.app = new Framework();
        this.ws;
        this.username = "";
        this.winner = "";
    }

    async launchMenu() {
        const bootMenu = new BootMenu();
        const ready = new Promise((resolve, reject) => {
            bootMenu.initialize(resolve, reject);
        });

        this.app.addComponent(bootMenu);
        this.render();

        ready.then((username) => {
            this.username = username;
            this.ws = new WS(`ws://localhost:8080/api/ws?username=${this.username}`);
            this.ws.onOpen(() => {
                console.log('Connected to the Dark Realm:', this.username);
                this.ws.sendMessage({ type: 'join', username: this.username });
            });
            this.ws.onClose(() => {
                console.log('Lost connection to the Abyss');
                this.ws.sendMessage({ type: 'leave', username: this.username });
            })
            this.app.clear();
            this.launchgame();

        }).catch((e) => {
            this.render();
        });
    }

    launchgame() {
        const leaveButton = new Component("button", { id: "leave-button" }, ["Flee"]);
        const endButton = new Component("button", { id: "end-button" }, ["Seal"]);
        const container = new Component("div", { id: "container" });
        const chat = new Chat({ id: "chat" }, this.ws, this.username);
        const waitRoom = new WaitingRoom(this.ws, this.username);

        leaveButton.actionListener('click', () => {
            this.ws.close();
            container.clear(); // Clear the map explicitly
            this.app.clear();
            this.launchMenu();
        });

        endButton.actionListener('click', () => this.ws.sendMessage({ type: "end" }));

        this.ws.onMessage(message => {
            if (message.type === "end") {
                this.winner = message.sender;
                this.ws.close();
                container.clear(); // Clear the map explicitly
                this.app.clear();
                this.launchEnd();
            }
        });

        const ready = new Promise((resolve, reject) => {
            waitRoom.initialize(resolve, reject);
        });

        ready.then(() => {
            const game = new Game({ id: "game" }, this.ws, this.username, waitRoom.playerList.children);
            container.replaceChildren(waitRoom, game);
            container.update();
        });

        container.addElement(chat, waitRoom);
        this.app.addComponent(leaveButton);
        this.app.addComponent(endButton);
        this.app.addComponent(container);

        this.render();
    }

    launchEnd() {
        const leaveButton = new Component("button", { id: "leave-button", className: "end" }, ["Abandon"]);
        leaveButton.actionListener('click', () => {
            container.clear(); // Clear the map explicitly
            this.app.clear();
            this.launchMenu();
        });

        const restart = new Component("button", { id: "restart-button", className: "end" }, ["Rise Again"]);
        restart.actionListener('click', () => {
            container.clear(); // Clear the map explicitly
            this.app.clear();
            this.ws = new WS(`ws://localhost:8080/api/ws?username=${this.username}`);
            this.launchgame();
        });

        const container = new Component("div", { id: "container" });
        const endMenu = new EndMenu(leaveButton, restart, this.winner); // Update winner logic

        container.addElement(endMenu);
        this.app.addComponent(container);
        this.render();
    }

    render() {
        this.app.render(this);
    }
}
