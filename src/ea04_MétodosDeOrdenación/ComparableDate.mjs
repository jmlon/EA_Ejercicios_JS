import assert from 'node:assert/strict';

export class ComparableDate {

    // private instance variables
    #year
    #month
    #date

    constructor(year, month, date) {
        this.#year = year;
        this.#month = month;
        this.#date = date;
    }

    // Relational operators > < invoke the toString method.
    // Observe that this fails for comparing dates in general
    // toString() {
    //     console.log("toString invoked");
    //     return ""+this.#year+"-"+this.#month+"-"+this.#date;
    // }

    // Zero-left padding, makes the string comparison work as expected
    toString() {
        return (""+this.#year).padStart(4,'0')+"-"+(""+this.#month).padStart(2,'0')+"-"+(""+this.#date).padStart(2,'0');
    }


    // valueOf is never called
    valoeOf() {
        console.log("valueOf invoked");
        return this.#date + this.#month*31 + this.#year*366;
    }

}


// Test dates
let d1 = new ComparableDate(2023,2,15);
let d2 = new ComparableDate(2023,10,31);

// Test cases
assert(d2>d1, `${d2} must be greater than ${d1}`);
assert(d1<d2, `${d1} must be less than ${d2}`);
