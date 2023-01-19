
// hadler for all borders to resize
function windowResize ( greenWindow = {} ) {
    const borders = [
        {
            element: greenWindow.querySelector('.window-border-top'),
            borderX: false,
            borderY: true,
            moveX: false,
            moveY: true,
            isPositive: true
        },
        {
            element: greenWindow.querySelector('.window-border-right'),
            borderX: true,
            borderY: false,
            moveX: false,
            moveY: false,
            isPositive: false
        },
        {
            element: greenWindow.querySelector('.window-border-bottom'),
            borderX: false,
            borderY: true,
            moveX: false,
            moveY: false,
            isPositive: false
        },
        {
            element: greenWindow.querySelector('.window-border-left'),
            borderX: true,
            borderY: false,
            moveX: true,
            moveY: false,
            isPositive: true
        },
        {
            element: greenWindow.querySelector('.window-border-top-left'),
            borderX: true,
            borderY: true,
            moveX: true,
            moveY: true,
            isPositive: true
        },
        {
            element: greenWindow.querySelector('.window-border-bottom-right'),
            borderX: true,
            borderY: true,
            moveX: false,
            moveY: false,
            isPositive: false
        }
    ];
    let firstEvent = true;

    borders.forEach(function (item) {
        item.element.onmousedown = function(event) {
            let clickPosLeft = event.x,
                clickPosTop = event.y,
                windowWidth = greenWindow.offsetWidth,
                windowHeight = greenWindow.offsetHeight,
                bordersElement = greenWindow.querySelector('.window-borders'),
                windowBodyElement = greenWindow.querySelector('.window-body'),
                coords = getCoords(greenWindow),
                shiftX = event.pageX - coords.left,
                shiftY = event.pageY - coords.top,
                windowBodyHeight = windowBodyElement.clientHeight - 2*parseInt(getComputedStyle(windowBodyElement).getPropertyValue('padding')),
                windowBodyWidth = windowBodyElement.offsetWidth - 2*parseInt(getComputedStyle(windowBodyElement).getPropertyValue('padding')),
                needModal = false
            ;

            document.querySelector("html").style.userSelect = 'none'; 

            function getCoords(elem) {
                let box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }

            function moveAt( event, moveX, moveY ) {
                if (moveX) greenWindow.style.left = event.pageX - shiftX + 'px';
                if (moveY) greenWindow.style.top = event.pageY - shiftY + 'px';
            }

            function changeSize( event, borderX, borderY, isPositive ) {
                let diffX = clickPosLeft - event.pageX,
                    diffY = clickPosTop - event.pageY;
                bordersElement.style.transition = '0s';
                windowBodyElement.style.transition = '0s';

                
                if ( borderX && isPositive ) {
                    greenWindow.style.width = windowWidth + diffX + 'px';
                    bordersElement.style.width = windowWidth + diffX + 'px';
                    windowBodyElement.style.width = windowBodyWidth + diffX + 'px';
                } else if ( borderX && !isPositive ) {
                    greenWindow.style.width = windowWidth - diffX + 'px';
                    bordersElement.style.width = windowWidth - diffX + 'px';
                    windowBodyElement.style.width = windowBodyWidth - diffX + 'px';
                }
                
                if ( borderY && isPositive ) {
                    greenWindow.style.height = windowHeight + diffY + 'px';
                    bordersElement.style.height = windowHeight + diffY + 'px';
                    windowBodyElement.style.height = windowBodyHeight + diffY + 'px';
                } else if ( borderY && !isPositive ) {
                    greenWindow.style.height = windowHeight - diffY + 'px';
                    bordersElement.style.height = windowHeight - diffY + 'px';
                    windowBodyElement.style.height = windowBodyHeight - diffY + 'px';
                }
                
            }

            focusWindow(event.target.closest(".window-green"));
            // changeSize(event, item.borderX, item.borderY, item.isPositive);
            greenWindow.style.zIndex = currentZindex++; // z-index priority

            let firstTarget = ( firstEvent === true ) ? event.target : '';
                    let timer;
            document.onmousemove = function(event) {
                if ( firstEvent === true ) {
                    firstEvent = false;
                }
                    
                    // ssome();
            // console.log(firstTarget);
            // console.log(event.path);
            // console.log(event.target);
            // console.log(firstEvent);
            // console.log(firstTarget);
            // console.log();
            // console.log();
                if ( event.pageY <= 0 ) {
                    let windowTopMinus = parseInt(greenWindow.style.top);

                    greenWindow.style.height = parseInt(greenWindow.style.height) + windowTopMinus + 'px';
                    bordersElement.style.height = parseInt(bordersElement.style.height) + windowTopMinus + 'px';
                    windowBodyElement.style.height = parseInt(windowBodyElement.style.height) + windowTopMinus + 'px';

                    greenWindow.onmouseup();
                    greenWindow.style.top = '0px';
                    document.querySelector("html").style.userSelect = '';
                    needModal = true;

                } else {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        if ( firstTarget !== event.target && firstTarget.classList ) {
                                console.log(event);
                            if (
                                firstTarget.classList[0] === 'window-border-top'         && event.target.classList[0] !== 'window-border-top-right' ||
                                firstTarget.classList[0] === 'window-border-bottom'      && event.target.classList[0] !== 'window-border-bottom-left' ||
                                firstTarget.classList[0] === 'window-border-top-right'   && event.target.classList[0] !== 'window-border-top' ||
                                firstTarget.classList[0] === 'window-border-bottom-left' && event.target.classList[0] !== 'window-border-bottom'||
                                firstTarget.classList[0] === 'window-border-right' ||
                                firstTarget.classList[0] === 'window-border-left'
                                ) {
                                console.log(firstTarget.classList[0]);
                                if ( firstTarget ) firstTarget.style.cursor = 'default';
                                greenWindow.onmouseup();
                                return false;
                            }
                        }
                    }, 10);
                    changeSize(event, item.borderX, item.borderY, item.isPositive);
                    moveAt(event, item.moveX, item.moveY);
                }
                    if ( parseInt(greenWindow.style.top) <= 0 && document.querySelector(`#ghost-window-${ghostWindowId}`) == null ){
                        console.log(event.pageY);
                        showGhostWindow(greenWindow, event, ghostWindowId);
                    } else if ( document.querySelector(`#ghost-window-${ghostWindowId}`) && parseInt(greenWindow.style.top) > 0 ) {
                        if (document.querySelector(`#ghost-window-${ghostWindowId}`)) removeGhostWindow(ghostWindowId);
                        ghostWindowId++;
                    }
            };

            greenWindow.onmouseup = function() {
                // firstTarget.style.cursor = 'default';
                firstTarget.style.cursor = '';
                document.onmousemove = null;
                greenWindow.onmouseup = null;
                firstEvent = true;
                firstTarget = '';
                console.log(greenWindow.style.top);
                if ( parseInt(greenWindow.style.top) < 0 ) greenWindow.style.top = '0px';
                setTimeout(() => {
                    removeGhostWindow(ghostWindowId);
                    bordersElement.style.transition = '';
                    windowBodyElement.style.transition = '';
                    if ( needModal && !window.screenTop && !window.screenY && confirm(`When u move mouse outside the page, it lose focus.
    Switch page to fullscreen mode?`) ) document.documentElement.requestFullscreen();
                    needModal = false;
                }, 10);
                
                return false;
            };

        }
        item.element.ondragstart = function() {
            return false;
        };

    });

}
//