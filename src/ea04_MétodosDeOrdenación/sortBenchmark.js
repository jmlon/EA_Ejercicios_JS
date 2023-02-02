const SAMPLES = 5;

function medirOrdenar(datos, pruebas) {
    let sum = 0;
    for(let j=0; j<pruebas; j++) {
        let start = performance.now();
        datos.sort();
        let finish = performance.now();
        sum += finish-start;
    }
    // console.log(`Tiempo con N=${datos.length} : ${finish-start} mseg`);
    console.log(`${datos.length},${sum/pruebas}`);
}

function medicionesRangoN(Nmin, Nmax) {
    for(let N=Nmin; N<=Nmax; N*=2) {
        const datos = [];
        for(let i=0; i<N; i++) {
            datos.push(Math.random());
        }
        medirOrdenar(datos, SAMPLES);
    }
}

medicionesRangoN(1000, 1000000);
