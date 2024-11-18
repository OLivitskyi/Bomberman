import Component from "./component.js";

/**
 * Represents a form component.
 * @class
 * @extends Component
 */
export default class Form extends Component {
    /**
     * @param {Object} props 
     * @param {...Input} inputs 
     */
    constructor(props, ...inputs) {
        super("form", props);
        this.props.className = "form";
        return this.init(...inputs);
    }

    /**
     * @param {...Input} inputs 
     * @returns {HTMLElement} 
     */
    init(...inputs) {
        const form = this.addElement(...inputs);
        return form;
    }
}