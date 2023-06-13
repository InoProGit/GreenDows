
// inputting code in highlighted window
// document.getElementById("code-wrap").append(document.getElementById("main-script").innerHTML);
// console.log( document.getElementById("main-script").innerHTML );
    
function scriptToString( string = '', selectorId = 'id' ) {
    const specialCharsMap = new Map([
        ['`', "&#96;"],
        ["'", "&#39;"],
        ['"', "&#34;"],
        ['[$,]', "&#36;"]
    ]);
    function replaceSpecialChars(string) {
        for (const [key, value] of specialCharsMap) {
        string = string.replace(new RegExp(key, "g"), value);
        }
        return string;
    }
    let theMainString = document.getElementById("radar-script").innerText;
    // document.getElementById("code-wrap").innerHTML = scriptToString(theMainString);
    // document.getElementById("code-wrap").append(scriptToString(theMainString));
    return replaceSpecialChars(string);    
}
// // highlight task solution code
// function initHighlitedText() {
//     hljs.highlightElement(document.getElementById("code-wrap"));      
// }
// functionsToInitWindow['initHighlitedText'] = initHighlitedText;
// //