
// generating array with composite numbers
function spawnRadarVals (size = 5) {
    let radarVals = [];

    let vree = `into ${radarVals} sol `;

    if ( size % 2 === 0 ) return size;
    for (let i = 0; radarVals.length < size*size; i++) {
        // first exeptions
        if (i == 1 || i == 0) radarVals.push(i);
        // push composite nums
        for (let j = 2; j < i;) {
            if (i % j++ === 0) {
                radarVals.push(i);
                break;
            }
        }
    }
    return radarVals;
}
//

// transition simple array with nums into object with decard coords
function radarToDecard ( radarVals = spawnRadarVals() ) {
    if ( !Array.isArray(radarVals) ) return 'radarVals must be array. Your data - ' + radarVals;
    let x = 0,
        y = 0,
        comment = '',
        decard = {},
        step = 1,
        stepsCount = 0,
        ratationX = 0,
        ratationY = 1
    ;
    radarVals.forEach(element => {
        if ( element === 0 ) {
            decard[element] = { // first element is Base
                x: 0,
                y: 0,
                comment: 'Base'
            };
            return true;
        }
            if /*--*/ ( ratationX === 0 && ratationY === 1 ) { // Up
                y++;
                if ( stepsCount === 0 && element !== radarVals[1] ) step++;
                stepsCount++;
                if ( step === stepsCount ) {
                    ratationX = 1;
                    ratationY = 0;
                    stepsCount = 0;
                }
            } else if ( ratationX === 1 && ratationY === 0 ) { // Right
                x++;
                stepsCount++;
                if ( step === stepsCount ) {
                    ratationX = 0;
                    ratationY = -1;
                    stepsCount = 0;
                }
            } else if ( ratationX === 0 && ratationY === -1 ) { // Down
                y--;
                if ( stepsCount === 0 ) step++;
                stepsCount++;
                if ( step === stepsCount ) {
                    ratationX = -1;
                    ratationY = 0;
                    stepsCount = 0;
                }
            } else if ( ratationX === -1 && ratationY === 0 ) { // Left
                x--;
                stepsCount++;
                if ( step === stepsCount ) {
                    ratationX = 0;
                    ratationY = 1;
                    stepsCount = 0;
                }
            }
            decard[element] = {
                x: x,
                y: y
            };
        
    });
    return decard;
}
//

// // object with functions to init window interface
// let functionsToInitWindow = {};
// //

// spawning radar matrix
function spawnRadar ( radarObj = radarToDecard(spawnRadarVals(11)) ) {
    let radarElemnt = document.getElementById("matrix-graph"),
        prevX = null
    ;
        radarElemnt.innerHTML = '';
    for (let value in radarObj) {
        let x = radarObj[value].x,
            y = radarObj[value].y,
            afterBegin = 'afterBegin',
            currRow = document.querySelector(`[row-decard-y="${y}"]`),
            spawnX = (  ) => {
                if ( currRow.firstChild !== null ) {
                    x < currRow.firstChild.getAttribute('decard-x') ? afterBegin = 'afterBegin' : afterBegin = 'beforeEnd';
                }

                currRow.insertAdjacentHTML(afterBegin, `<td decard-x="${x}" decard-y="${y}">${value}</td>`);
            }
        ;

        if ( !currRow ) { // spawn first Y row
            if ( radarElemnt.firstChild == null ) {
                let newRow = document.createElement('tr');
                newRow.setAttribute('row-decard-y', y);
                radarElemnt.prepend(newRow);
                currRow = document.querySelector(`[row-decard-y="${y}"]`);
                spawnX();
                currRow.firstChild.classList.add('base');
            } else { // spawn Y rows
                if ( !document.querySelector(`[row-decard-y="${y}"]`) ) {
                    y > radarElemnt.firstChild.getAttribute('row-decard-y') ? afterBegin = 'afterBegin' : afterBegin = 'beforeEnd';
                    radarElemnt.insertAdjacentHTML(afterBegin, `<tr row-decard-y="${y}" "></tr>`);
                }
                currRow = document.querySelector(`[row-decard-y="${y}"]`);
                spawnX();
            }
        } else if ( currRow ) {
                spawnX();
        } else {
            console.log('Something wrong with Y row. His value :');
            // console.log(currRow);
        }
    }
}

// // render matrix on submit button in task window
// function initFormMatrixSubmit() {
//     let form = document.getElementById("matrix-form");
//     form.onsubmit = function () {
//         let number = document.getElementById("matrix_size").value;
//         spawnRadar( radarToDecard( spawnRadarVals(number) ) );
//         document.getElementById("matrix-graph").closest(".window-green").style.zIndex = currentZindex++;
//         const tableCell = document.querySelectorAll('td'),
//               matrixNotice = document.getElementById("matrix-notice");
//         matrixNotice.classList.remove("active");
//         matrixNotice.innerText = '0';
            
//         //перебираем все найденные элементы и вешаем на них события
//         [].forEach.call( tableCell, function(el) {
//             //вешаем событие
//             el.onclick = function() {
//                 ( document.getElementsByClassName('clicked')[0] ) ? document.getElementsByClassName('clicked')[0].classList.remove("clicked") : false;
//                 this.classList.add("clicked");
//                 console.log(`координата радара: ${this.innerHTML}; декард Х: ${this.getAttribute('decard-x')}; декард У: ${this.getAttribute('decard-y')}`);
//                 matrixNotice.classList.add("active");
//                 matrixNotice.innerText = `Kоордината радара: ${this.innerHTML}; Декард Х: ${this.getAttribute('decard-x')}; Декард У: ${this.getAttribute('decard-y')}`;
//             }
//         });
//         return false;
//     };
// }

// functionsToInitWindow['initFormMatrixSubmit'] = initFormMatrixSubmit;
// //