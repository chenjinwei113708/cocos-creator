export default class ItemModel {
    constructor (node) {
        this.node = node;
        this.isBorken = false;

    }

    getPosition () {
        return this.node.position;
    }
}
