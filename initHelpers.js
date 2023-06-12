
// object with functions to init window interface
let functionsToInitWindow = {};
//

// render matrix on submit button in task window
function initFormMatrixSubmit() {
    let form = document.getElementById("matrix-form");
    form.onsubmit = function () {
        let number = document.getElementById("matrix_size").value;
        spawnRadar( radarToDecard( spawnRadarVals(number) ) );
        document.getElementById("matrix-graph").closest(".window-green").style.zIndex = currentZindex++;
        const tableCell = document.querySelectorAll('td'),
              matrixNotice = document.getElementById("matrix-notice");
        matrixNotice.classList.remove("active");
        matrixNotice.innerText = '0';
            
        //перебираем все найденные элементы и вешаем на них события
        [].forEach.call( tableCell, function(el) {
            //вешаем событие
            el.onclick = function() {
                ( document.getElementsByClassName('clicked')[0] ) ? document.getElementsByClassName('clicked')[0].classList.remove("clicked") : false;
                this.classList.add("clicked");
                console.log(`координата радара: ${this.innerHTML}; декард Х: ${this.getAttribute('decard-x')}; декард У: ${this.getAttribute('decard-y')}`);
                matrixNotice.classList.add("active");
                matrixNotice.innerText = `Kоордината радара: ${this.innerHTML}; Декард Х: ${this.getAttribute('decard-x')}; Декард У: ${this.getAttribute('decard-y')}`;
            }
        });
        return false;
    };
}

functionsToInitWindow['initFormMatrixSubmit'] = initFormMatrixSubmit;
//

// highlight task solution code
function initHighlitedText() {
    hljs.highlightElement(document.getElementById("code-wrap"));      
}
functionsToInitWindow['initHighlitedText'] = initHighlitedText;
//