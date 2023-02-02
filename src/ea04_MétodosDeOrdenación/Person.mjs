export class Person {

    constructor(n, a, e, p) {
        this.nombres = n;
        this.apellidos = a;
        this.edad = e;
        this.peso = p;
    }

    get getNombres() {
        return nombres;
    }

    get getApellidos() {
        return apellidos;
    }

    get getEdad() {
        return edad;
    }

    get getPeso() {
        return peso;
    }

    toString() {
        return this.nombres+" "+this.apellidos+" : "+this.edad+", "+this.peso;
    }

    /*
    compareTo(Person o) {
        // TODO Auto-generated method stub
        return 0;
    }
    */
    
}