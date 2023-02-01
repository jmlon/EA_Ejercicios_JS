import assert from 'node:assert/strict';

export class Bag {

    constructor() {
        this.items = [];    // Se usa una lista de JS
    }

    add(item) {
        this.items.push(item);
    }

    isEmpty() {
        return this.items.length===0;
    }

    size() {
        return this.items.length;
    }

}


// Algunas pruebas unitarias
let bag = new Bag();
assert(bag.isEmpty());
assert(bag.size()===0);
bag.add(1);
bag.add("Hola");
assert(bag.size()===2);
