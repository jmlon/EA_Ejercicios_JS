class Punto2DCartesiano extends Punto2D {

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(" + this.x + "," + this.y + ")";
    }

    get getX() { return this.x }

    get getY() { return this.y }

    set setX(newx) { this.x = newx }

    set setY(newy) { this.y = newy }

}