import assert from 'node:assert/strict';

// Una clase no exportada es basicamente privada al modulo
class Nodo {
    item
    sig
}

export default class ListaSimple {

    #first          // Referencia al primer nodo
    #n = 0          // Número de nodos en la lista

    /**
     * Agregar un item a la cabeza de la lista
     * @param item
     */
    addHead(item) {
        let x = new Nodo();
        x.item = item;
        x.sig = this.#first;
        this.#first = x;
        this.#n++;
    }

    /**
     * Remover el primer nodo de la lista
     * @return item contenido en el nodo eliminado
     * @throws Exception
     */
    removeHead() {
        if (!this.#first)
            throw new Exception("Lista vacia");
        const i = this.#first.item;
        this.#first = this.#first.sig;
        this.#n--;
        return i;
    }

    /**
     * True si la lista esta vacia
     * @return
     */
    isEmpty() {
        return this.#n == 0;
    }

    /**
     * @return Longitud de la lista
     */
    size() {
        return this.#n;
    }


}



// Algunas pruebas unitarias
const l = new ListaSimple();
assert(l.isEmpty());
assert(l.size()==0);
l.addHead(1);
l.addHead(2);
l.addHead("Hola");
l.addHead("Mundo");
assert(!l.isEmpty());
assert(l.size()==4);
const item = l.removeHead();
assert(item=="Mundo");
assert(l.size()==3);
l.removeHead();
l.removeHead();
l.removeHead();
assert(l.isEmpty());
assert(l.size()==0);



// TODO : Ejercicios
// 1. Implementar addLast, removeLast
// 2. Implementar metodos basados en la posicion del item: get(i), remove(i), insert(i)
// 3. Implementar un método invert() para invertir la lista
// 4. Implementar un método split() para partir la lista a la mitad


