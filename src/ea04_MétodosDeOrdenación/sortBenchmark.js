
function medirOrdenar(datos) {
    let start = performance.now();
    datos.sort();
    let finish = performance.now();
    // console.log(`Tiempo con N=${datos.length} : ${finish-start} mseg`);
    console.log(`${datos.length},${finish-start}`);
}

function medicionesRangoN(Nmin, Nmax) {
    for(let N=Nmin; N<=Nmax; N*=2) {
        const datos = [];
        for(let i=0; i<N; i++) {
            datos.push(Math.random());
        }
        medirOrdenar(datos);
    }
}

medicionesRangoN(1000, 1000000);
