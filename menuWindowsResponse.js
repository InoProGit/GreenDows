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
    <label for="matrix-size">Ширина радара: <input id="matrix_size" name="matrix_size" type="number" step="2" min="5" value="5" max="11"></label>
    <br>
    <button type="submit">Создать радар</button>
</form>

</div>`);
            
const defaultRadarData = JSON.stringify(`<div class="window-content">
<table>
    <tbody id="matrix-graph"></tbody>
</table>
</div>`);

const taskSolutionData = JSON.stringify(`<div class="window-content">
<pre><code id="code-wrap" class="hljs language-javascript"></code></pre>
<br>
<div class="author">Styled with <a href="https://highlightjs.org/">highlightjs.org</a></div>
</div>`);

const interfaceSolutionData = JSON.stringify();

const jsonWindowItemsResponse = `{
    "tasks" : [
      {
        "id": 1,
        "name": "Taskk",
        "windowSizeClass" : "body-small",
        "windowBodyStyles": "",
        "windowData": ${tasksWindowData},
        "functionsToInit": ["initFormMatrixSubmit"]
      },
      {
        "id": 2,
        "name": "Default Radar",
        "windowSizeClass" : "body-small window-radar",
        "windowBodyStyles": "width: 380px; height: 380px;",
        "individualStyles": [ "tr {display: flex; align-items: center;}" ],
        "windowData": ${defaultRadarData},
        "functionsToInit": ["initRadar"]
      },
      {
        "id": 3,
        "name": "Task solution",
        "windowSizeClass" : "body-medium",
        "windowData": ${taskSolutionData},
        "functionsToInit": ["initHighlitedText"]
      },
      {
        "id": 4,
        "name": "Interface Solution",
        "windowSizeClass" : "body-medium",
        "windowData": ${defaultRadarData}
      }
    ]
}`;