const tasksWindowData = JSON.stringify(`<div class="window-content">

<article class="markdown-body entry-content container-lg" itemprop="text"><h1>Дроны</h1>
    <p>
        Мйарп склонился над монитором подключенным к древнему радару.
        Он ждал появления свидрушей с минуты на минуту. Дроны были наготове, единственная проблема была в том,
        что для поимки свидруша дрону нужны были X/Y координаты сектора относительно базы с координатами 0/0 в декартовой системе координат.
        Соответственно координаты квадрата, который располагался на карте  справа от базы были 1/0, снизу 0/-1 и т.д.
    </p>
    <p>
        Если бы обычный радар не вышел из строя, Мйарп бы так не переживал.
        Но древний радар использовал странную систему координат. Каждый квадрат обозначался уникальным числом. База находилась в квадрате 0.
        Центр карты на радаре выглядел так:
    </p>
    <div class="snippet-clipboard-content position-relative overflow-auto" style="text-align: center;">
        <pre>
            <code>
35  15  16  18  20
34  14  1   4   21
33  12  0   6   22
32  10  9   8   24
30  28  27  26  25
            </code>
        </pre>
    </div>
    <p>
        Дело оставалось за малым - перевести координаты, выдаваемые древним радаром, в координаты понятные дрону.
        Компьютер понимал любой язык, но Мйарп выбрал свой любимый и набрал
        <code>define ancientToModern(n int) (x,y int)</code>. Свидрушы приближались...
    </p>
</article>
<br>
<form id="matrix-form" action="#">
    <label for="matrix_size">Ширина радара: <input id="matrix_size" name="matrix_size" type="number" step="2" min="5" value="5" max="11"></label>
    <br>
    <button type="submit">Создать радар</button>
    <div class="button" window-id-to-call="3">Открыть решение</div>
</form>
<div id="matrix-notice-wrap">
    <div id="matrix-notice">0</div>
</div>
<table>
    <tbody id="matrix-graph"></tbody>
</table>

</div>`);
            
const defaultRadarData = JSON.stringify(`<div class="window-content">
</div>`);

const taskSolutionData = JSON.stringify(`<div class="window-content">
<pre><code id="code-wrap" class="hljs language-javascript">
// generating array with composite numbers
function spawnRadarVals (size = 5) {
    let radarVals = [];

    let vree = &#96;into &#36;{radarVals} sol &#96;;

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
    if ( !Array.isArray(radarVals) ) return &#39;radarVals must be array. Your data - &#39; + radarVals;
    let x = 0&#36;
        y = 0&#36;
        comment = &#39;&#39;&#36;
        decard = {}&#36;
        step = 1&#36;
        stepsCount = 0&#36;
        ratationX = 0&#36;
        ratationY = 1
    ;
    radarVals.forEach(element => {
        if ( element === 0 ) {
            decard[element] = { // first element is Base
                x: 0&#36;
                y: 0&#36;
                comment: &#39;Base&#39;
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
                x: x&#36;
                y: y
            };
        
    });
    return decard;
}
//

// object with functions to init window interface
let functionsToInitWindow = {};
//

// spawning radar matrix
function spawnRadar ( radarObj = radarToDecard(spawnRadarVals(11)) ) {
    let radarElemnt = document.getElementById(&#34;matrix-graph&#34;)&#36;
        prevX = null
    ;
        radarElemnt.innerHTML = &#39;&#39;;
    for (let value in radarObj) {
        let x = radarObj[value].x&#36;
            y = radarObj[value].y&#36;
            afterBegin = &#39;afterBegin&#39;&#36;
            currRow = document.querySelector(&#96;[row-decard-y=&#34;&#36;{y}&#34;]&#96;)&#36;
            spawnX = (  ) => {
                if ( currRow.firstChild !== null ) {
                    x < currRow.firstChild.getAttribute(&#39;decard-x&#39;) ? afterBegin = &#39;afterBegin&#39; : afterBegin = &#39;beforeEnd&#39;;
                }

                currRow.insertAdjacentHTML(afterBegin&#36; &#96;<td decard-x=&#34;&#36;{x}&#34; decard-y=&#34;&#36;{y}&#34;>&#36;{value}</td>&#96;);
            }
        ;

        if ( !currRow ) { // spawn first Y row
            if ( radarElemnt.firstChild == null ) {
                let newRow = document.createElement(&#39;tr&#39;);
                newRow.setAttribute(&#39;row-decard-y&#39;&#36; y);
                radarElemnt.prepend(newRow);
                currRow = document.querySelector(&#96;[row-decard-y=&#34;&#36;{y}&#34;]&#96;);
                spawnX();
                currRow.firstChild.classList.add(&#39;base&#39;);
            } else { // spawn Y rows
                if ( !document.querySelector(&#96;[row-decard-y=&#34;&#36;{y}&#34;]&#96;) ) {
                    y > radarElemnt.firstChild.getAttribute(&#39;row-decard-y&#39;) ? afterBegin = &#39;afterBegin&#39; : afterBegin = &#39;beforeEnd&#39;;
                    radarElemnt.insertAdjacentHTML(afterBegin&#36; &#96;<tr row-decard-y=&#34;&#36;{y}&#34; &#34;></tr>&#96;);
                }
                currRow = document.querySelector(&#96;[row-decard-y=&#34;&#36;{y}&#34;]&#96;);
                spawnX();
            }
        } else if ( currRow ) {
                spawnX();
        } else {
            console.log(&#39;Something wrong with Y row. His value :&#39;);
            // console.log(currRow);
        }
    }
}
function initRadar( number = 5 ) {
    spawnRadar(radarToDecard(spawnRadarVals(number)));
}
functionsToInitWindow[&#39;initRadar&#39;] = initRadar;
//

// render matrix on submit button in task window
function initFormMatrixSubmit() {
    let form = document.getElementById(&#34;matrix-form&#34;);
    form.onsubmit = function () {
        let number = document.getElementById(&#34;matrix_size&#34;).value;
        spawnRadar( radarToDecard( spawnRadarVals(number) ) );
        document.getElementById(&#34;matrix-graph&#34;).closest(&#34;.window-green&#34;).style.zIndex = currentZindex++;
        return false;
    };
}

functionsToInitWindow[&#39;initFormMatrixSubmit&#39;] = initFormMatrixSubmit;
//
</code></pre>
<br>
<div class="author">Styled with <a href="https://highlightjs.org/">highlightjs.org</a></div>
</div>`);

const interfaceSolutionData = JSON.stringify(``);

const jsonWindowItemsResponse = `{
       "1" : {
        "id": 1,
        "name": "Taskk",
        "windowSizeClass" : "body-small",
        "windowBodyStyles": "",
        "windowData": ${tasksWindowData},
        "functionsToInit": ["initFormMatrixSubmit"]
      },
       "2" : {
        "id": 2,
        "name": "Default Radar",
        "windowSizeClass" : "body-small window-radar",
        "windowBodyStyles": "width: 380px; height: 380px;",
        "individualStyles": [ "tr {display: flex; align-items: center;}" ],
        "windowData": ${defaultRadarData},
        "functionsToInit": ["initRadar"]
      },
       "3" : {
        "id": 3,
        "name": "Task solution",
        "windowSizeClass" : "body-medium",
        "windowData": ${taskSolutionData},
        "functionsToInit": ["initHighlitedText"]
      },
       "4" : {
        "id": 4,
        "name": "Interface Solution",
        "windowSizeClass" : "body-small",
        "windowData": ${defaultRadarData}
      }
}`;