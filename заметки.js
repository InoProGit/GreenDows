async function removeMenuItem ( element = {}, menu = {} ) {
    let styles = window.getComputedStyle(element),
        elementFullHeight = element.offsetHeight + parseInt(styles.marginTop),
        menuBottom = parseInt(menu.style.bottom) + elementFullHeight
    ;
    element.style.transition = '0.5s';
    element.style.height = element.clientHeight + 'px';
    menu.style.bottom = menuBottom + 'px';
    
    // разобраться почему f3 не работает без setTimeout???
    // function f1 () {
    //     return new Promise(function(resolve){
    //         setTimeout(() => {
    //             element.style.overflow = 'hidden';
    //             element.style.margin = '0px';
    //             element.style.transform = 'scale(0)'; 
    //             element.style.height = '0';
    //         }, 0);
    //     });
    // }
    // function f2 () {
    //     return new Promise(function(resolve){
    //         setTimeout(() => {
    //             element.remove();
    //             document.getElementById('open-tasks').click();
    //         }, 450);
    //     });
    // }
    // function f3 () {
    //     return new Promise(function(resolve){
    //         setTimeout(() => {
    //         if ( menu.getElementsByTagName('ul')[0].getElementsByTagName('div')[0] ) {
    //             console.log(1);
    //         }
            
    //     }, 450);
    //     });
    // }
    
    // f1().then( f2().then( f3() ) );
        
    // и почему тут все работает только внутри таймаутов???
    let promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {element.style.overflow = 'hidden';
            element.style.margin = '0px';
            element.style.transform = 'scale(0)'; 
            element.style.height = '0';
            console.log(1);
            resolve("готово1!");
        }, 0);
    });
    let promise2 = new Promise((resolve, reject) => {
        setTimeout(() => {
            element.remove();
            document.getElementById('open-tasks').click();
            console.log(2);
            resolve("готово2!");
        }, 450)
    });
    let promise3 = new Promise((resolve, reject) => {
        setTimeout(() => {element.style.overflow = 'hidden';
            if ( menu.getElementsByTagName('ul')[0].getElementsByTagName('div')[0] ) {
                console.log(3);
            }
            resolve("готово3!");
        }, 0);
    });

    await promise1;
    await promise2;
    await promise3;
}



//////////////////////////////////////////////////////////////////////////////////////////////