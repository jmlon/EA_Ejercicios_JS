
function promedio(inputArray) {
    let sum = 0;                    // Tiempo constante t1, f1=1.
    for(let x of inputArray) {      // Inicialización, comparación, incremento: Tiempo constante. Frecuencia inicialización f2=1, comparación f3=N+1, incremento f4=N
        sum += x;                   // Tiempo operación/asign constante t5, frecuencia f5=N
    }
    return sum/inputArray.length;   // Operación aritmetica y retorno: Tiempo constante t6, frecuencia f6=1.
}


function medirTiempo(N) {
    const datos = [];
    for(let i=0; i<N; i++) {
        datos.push(Math.random());
    }
    let start = performance.now();
    promedio(datos);
    let finish = performance.now();
    console.log(`Tiempo con N=${N} : ${finish-start} mseg`);
}


let p = promedio([1,2,3,4,5,6,7,8,9,10]);
console.log(`Promedio: ${p}`);

for(let N=1000; N<100000; N*=2)
    medirTiempo(N);
