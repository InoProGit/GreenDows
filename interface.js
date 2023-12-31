// function blocker clicks on active animation
function blockClicked ( element = {}, time = 0 ) {
    if( !element.classList.contains("blocked") ) {
        element.classList.add("blocked");
        let blockedTimeOut = setTimeout(() => {
            element.classList.remove("blocked");
        }, time);
    }
}
//

// checking object for emptiness
function isEmptyObject ( rest = {} ) {
    return ( Object.keys(rest).length === 0 && rest.constructor === Object ) ?  true : false;
}
//

// checking unexpected params in function, if have throw error
function unexpectedParams(rest) {
    if ( !isEmptyObject(rest) ) throw new TypeError( message = `
Unexpected params given: ` + JSON.stringify(rest) + ` .
Make params align with expectations.` );
}
//

// hang any function onClick by selector
function forEachClick (
    {
        selector          = '',
        func              = Function,
        needTimeOut       = false,
        secTimeOut        = 0,
        selectorToBlocked = '',
        ...rest
    }
) {
    try {
        if ( typeof selector !== 'string' ||
             selector === '' ||
             !document.querySelectorAll(selector)[0]
            ) throw new ReferenceError("U pass not String in 'selector' or it wasn't found");
        if ( func == Function || typeof func !== 'function') throw new TypeError("U didn't pass the 'func', or u pass not a Function");
        if ( typeof needTimeOut !== 'boolean' ) throw new TypeError("Ur pass not Boolean in 'needTimeOut'");
        if ( typeof secTimeOut !== 'number' ) throw new TypeError("Ur pass not Number in 'secTimeOut'");
        if ( secTimeOut < 0 ) throw new TypeError("Ur Number - 'secTimeOut' is lower then 0");
        if ( needTimeOut !== false && typeof selectorToBlocked !== 'string' ||
             needTimeOut !== false && selectorToBlocked === '' ||
             needTimeOut !== false && !document.querySelectorAll(selectorToBlocked)[0]
            ) throw new ReferenceError("Ur pass not String in 'selectorToBlocked' or it wasn't found");
        unexpectedParams(rest);

        [].forEach.call( document.querySelectorAll(selector), function(element) {
            element.onclick = function(event) {
                if ( element.classList.contains("blocked") || element.closest(".blocked") === null ) {
                    func(this, event);
                    if ( needTimeOut ) {
                        blockClicked(document.querySelectorAll(selectorToBlocked)[0], secTimeOut);
                    }
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
}
//

// hang any function by selector
function forEachFunc ( selector = '', func = Function ) {
    try {
        if ( typeof selector !== 'string' ||
             selector === '' ||
             !document.querySelectorAll(selector)[0]
            ) throw new ReferenceError("U pass not String in 'selector' or it wasn't found");
        if ( func == Function || typeof func !== 'function') throw new TypeError("U didn't pass the 'func', or it's not a Function");

        document.querySelectorAll(selector).forEach( function(element) {
            func(element);
        });
    } catch (err) {
        console.error(err);
    }
}
//

// array with selectors and functions when click outside it, hanged on document event click
let outsideElements = [];

function setOutsideClick ( selector = '', parent = '', funCall = Function ) {
    try {
        if ( typeof selector !== 'string' ) throw new TypeError("U pass not String in 'selector'");
        if ( typeof parent !== 'string' ) throw new TypeError("U pass not String in 'parent'");
        if (!document.querySelectorAll(selector)[0]) throw new ReferenceError("Ur 'selector' wasn't found");
        if (!document.querySelectorAll(parent)[0]) throw new ReferenceError("Ur 'parent' wasn't found");
        if ( funCall == Function || typeof funCall !== 'function') throw new TypeError("U didn't pass the 'funCall', or u pass not a Function");

        outsideElements.push({
            selector: selector,
            parent: parent,
            funCall: funCall
        });
        
    } catch (err) {
        console.error(err);
    }
}

function clickOutside ( outsideElements = [] ) {
    outsideElements.forEach( function(element) {
        if ( document.querySelectorAll(element.selector)[0].classList.contains("active") && !event.target.closest(element.parent) ) {
            element.funCall();
            console.warn('click outside element in array');
        }
    });
}

function clickOutsideGreenWidnow ( event = {} ) {
    const activeElement = document.querySelector(".window-green.active");
    if ( activeElement && !event.target.closest(".window-green") && !event.target.closest(".taskbar-item") ) {
        focusOutWindow(activeElement);
        deactivate('.taskbar-item.active');
    }
    
    // outsideElements.forEach( function(element) {
    //     if ( document.querySelectorAll(element.selector)[0].classList.contains("active") && !event.target.closest(element.parent) ) {
    //         element.funCall();
    //         console.warn('click outside element in array');
    //     }
    // });
}

// hanger of all mouseDown events
document.addEventListener( 'mousedown' , function (event) {
    clickOutside(outsideElements);
    clickOutsideGreenWidnow(event);
});
//

// set crosBrowser transform style
function setTransformStyle ( element = {}, value = '' ) {
    try {
        element.style.webkitTransform = value;
        element.style.mozTransform = value;
        element.style.msTransform = value;
        element.style.oTransform = value;
        element.style.transform = value;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
//

// set window on center
function setWindowOnCenter( element = {} ) {
    setTransformStyle(element, 'translate(-50%, -50%)');
    element.style.top = '50%';
    element.style.left = '50%';

    let elementPositions = element.getBoundingClientRect(),
        taskBarHeight = document.getElementById("taskbar-overlay").offsetHeight,
        borderWidthSingle = parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--border-width') ) / 2
    ;
    element.style.top = 
        ( elementPositions.top < borderWidthSingle + taskBarHeight ) ?
            borderWidthSingle + 'px'
                :
            elementPositions.top - taskBarHeight + 'px'
    ;
    element.style.left = 
        ( window.innerWidth - element.offsetWidth > elementPositions.left ) ?
            elementPositions.left + 'px'
                :
            borderWidthSingle + 'px' 
    ;
    
    setTransformStyle(element, 'unset');
}
//

// animation scale 0 to 1
function transformAnimation (
    {
        element        = undefined,
        transition     = '1.00s',
        transitionEnd  = '',
        transformFrom  = 'scale(0)',
        transformTo    = 'scale(1)',
        transformEnd   = '',
        classToRemove  = '',
        classToAdd     = '',
        ...rest
    }
) {
    try {
        if (!element) throw new TypeError("U didn't pass the element");
        unexpectedParams(rest);

        
        setTransformStyle(element, transformFrom);
        blockClicked(element, parseFloat(transition) * 1000 + 1);
        
        setTimeout(() => {
            element.style.transition = transition;
            setTransformStyle(element, transformTo);
        }, 1);
        setTimeout(() => {
            if ( transitionEnd ) element.style.transition = transitionEnd;
            if ( classToRemove ) element.classList.remove(classToRemove);
            if ( transformEnd ) setTransformStyle(element, transformEnd);
            if ( classToAdd ) element.classList.add(classToAdd)
        }, parseFloat(transition) * 1000 + 1 );
    } catch (err) {
        console.error(err);
    }
}
//

// input element before #taskbar
function spawnHtml ( [elementHTML = '', selector = '', positionTop = 0, positionLeft = 0] ) {
    let taskbar = document.getElementById('taskbar-wrap')
        element = false;

    taskbar.insertAdjacentHTML('beforebegin', elementHTML);
    
    if ( selector !== '' && document.querySelectorAll(selector)[0] ) {
        element = document.querySelectorAll(selector)[0];
        ( positionTop !== 0 ) ? element.style.top = positionTop + 'px' : false;
        ( positionLeft !== 0 ) ? element.style.left = positionLeft + 'px' : false;
    }
    return element;
}
//

// get usable html height (html - taskbar)
function getUsableHeight () {
    return window.innerHeight - document.querySelector("#taskbar-overlay").offsetHeight + 3;
}
//
// debounce function
function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
//

// helpers END

// removing window, showing menu item, show/hide menu on close button
function closeWindow ( element = undefined ) {
    let windowElement = element.closest(".window-green"),
        transition = getComputedStyle(document.documentElement).getPropertyValue('--fast-transition'),
        taskId = windowElement.getAttribute('task-id'),
        elementInTaskBar = document.querySelectorAll(`.taskbar-item[task-id="${taskId}"]`)[0],
        menuElement = document.querySelectorAll(`.task-list-item.hidden[task-id="${taskId}"]`)[0],
        menuWrap = document.getElementById("menu-wrap")
    ;
    
    transformAnimation({
        element: windowElement,
        transition: transition,
        transformFrom: 'scale(1)',
        transformTo:  'scale(0)'
    });
    transformAnimation({
        element: elementInTaskBar,
        transition: transition,
        transformFrom: 'scale(1)',
        transformTo:  'scale(0)',
        classToAdd: 'mg0imp'
    });
        setTasksMargin();
        menuElement.style.margin = '';
        menuElement.style.transform = 'scale(1)'; 
        menuElement.style.height = '';
        menuElement.style.transition = '0s';

    if ( menuWrap.querySelectorAll(".task-list-item.hidden").length == menuWrap.querySelectorAll(".task-list-item").length ) {
        menuWrap.style.transition = getComputedStyle(document.documentElement).getPropertyValue('--default-transition');
        document.getElementById("taskbar").style.right = '';
    } else {
        menuWrap.style.transition = '0s';
                
        setTimeout(() => {
            menuWrap.style.transition = getComputedStyle(document.documentElement).getPropertyValue('--default-transition');

        }, 1 );
    }

    menuElement.classList.remove("hidden");
    menuElement.classList.add('visible');
    initializeMenu();

    setTimeout(() => {
        windowElement.remove();
        elementInTaskBar.remove();
        setTasksMargin();
        if ( !document.querySelectorAll(".taskbar-item")[0] ) {
            document.querySelectorAll(".taskbar-item-empty")[0].style.opacity = 1;
        }

    }, parseFloat(transition) * 1000 );
}
//

// nidding window, set inactive menu item
function hideWindow ( element = {} ) {
    let windowElement = element.closest(".window-green"),
        transition = getComputedStyle(document.documentElement).getPropertyValue('--default-transition'),
        taskId = windowElement.getAttribute('task-id'),
        elementInTaskBar = document.querySelectorAll(`.taskbar-item[task-id="${taskId}"]`)[0],
        taskBarElementRect = elementInTaskBar.getBoundingClientRect(),
        windowRect = windowElement.getBoundingClientRect()
    ;

    if ( !windowElement.getAttribute('prev-top') ) windowElement.setAttribute('prev-top', windowElement.style.top);
    if ( !windowElement.getAttribute('prev-left') ) windowElement.setAttribute('prev-left', windowElement.style.left);
    windowElement.style.transition = '1s';
    windowElement.style.top = taskBarElementRect.top + 'px';
    windowElement.style.left = taskBarElementRect.left - windowRect.width/2 + 'px';

    setTimeout(() => {
        focusOutWindow(windowElement);
        elementInTaskBar.classList.remove('active');
    }, parseFloat(transition) * 1000);
    // blockClicked( elementInTaskBar, parseFloat(transition) * 2000 + 10);
    // console.log(elementInTaskBar.getBoundingClientRect());

    // .getBoundingClientRect()
    
    transformAnimation({
        element: windowElement,
        transition: transition,
        transformFrom: 'scale(1)',
        transformTo:  'scale(0)',
        classToAdd: 'hidden'
    });
}
//

// setting window to full screen mode
function maximizeAction (elementHanger, event) {
    let currentWindow = elementHanger.closest(".window-green");
    console.log(currentWindow);
    console.log(event.target);
    if ( !currentWindow.classList.contains("maximized") ) {
        maximizeWindow({currentWindow: currentWindow});
    } else {
        minimizeWindow({
            currentWindow: currentWindow,
            showBorders: true,
        });
    }

}

function maximizeWindow ({
    currentWindow = {},
    useSizeFromGreen = false,
    useFullSize = true,
    ...rest
}) {
    unexpectedParams(rest);
    
    let bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
        bordersWrap = currentWindow.querySelector(".window-borders"),
        bodyElement = currentWindow.querySelector(".window-body"),
        bodyMargin = parseFloat(window.getComputedStyle(bodyElement).margin),
        bodyDifference = 0,
        innerPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--inner-padding')),
        headerHeight = parseFloat(currentWindow.querySelector(".window-top").offsetHeight),
        width  = parseFloat(window.innerWidth),
        height = getUsableHeight(),
        left   = -bordersWidth,
        top    = -bordersWidth,
        bodyWidth = width,
        bodyHeight = height;
        
    currentWindow.setAttribute('minimized-width', parseFloat(currentWindow.offsetWidth));
    currentWindow.setAttribute('minimized-height', parseFloat(currentWindow.offsetHeight));
    currentWindow.setAttribute('minimized-left', parseFloat(currentWindow.style.left));
    currentWindow.setAttribute('minimized-top', parseFloat(currentWindow.style.top));
    currentWindow.setAttribute('body-margin', bodyMargin);
    if (currentWindow.style.right) currentWindow.setAttribute('minimized-right', parseFloat(currentWindow.style.right));
    if (currentWindow.style.bottom) currentWindow.setAttribute('minimized-bottom', parseFloat(currentWindow.style.bottom));

    bodyDifference =  -(bordersWidth*2);
    
    let ghostWindowElement = (useSizeFromGreen) ? document.querySelector('#ghost-window-'+ghostWindowId) : false,
        prevLeft = 0;
    useFullSize = (ghostWindowElement) ? ghostWindowElement.classList.contains('use-full-size') : true;

    if ( useSizeFromGreen && !useFullSize ) {
        width  = parseFloat(ghostWindowElement.getAttribute('green-width'));
        height = parseFloat(ghostWindowElement.getAttribute('green-height'));
        top    = parseFloat(ghostWindowElement.getAttribute('green-top'));
        left   = parseFloat(ghostWindowElement.getAttribute('green-left'));
        bottom = parseFloat(ghostWindowElement.getAttribute('green-bottom'));
        right  = parseFloat(ghostWindowElement.getAttribute('green-right'));

        let ghostMargin = parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--ghost-window-margin') );
        if ( left <= ghostMargin ) left = 0;
        prevLeft = left;

        bordersWrap.style.transition = 'all 0s';
        bordersWrap.style.width = width + 'px';
        bordersWrap.style.height = height + 'px';
        bodyWidth = width - innerPadding - bodyMargin;
        bodyHeight = height - bordersWidth - bodyMargin - innerPadding;
        currentWindow.classList.add("maximized-not-full");

    } else if ( useFullSize === true) {
        width  += bordersWidth * 2;
        height += bordersWidth + 2;
        bordersWrap.style.opacity = 0;
        bodyElement.style.paddingBottom = innerPadding + parseFloat(document.querySelector("#taskbar-overlay").offsetHeight) + 'px';
        bodyElement.style.margin   = '0px';
        bodyElement.style.paddingRight = innerPadding + 'px';

        currentWindow.classList.add("borders-hidden");
        currentWindow.classList.remove("minimized");
        currentWindow.classList.add("maximized");
    }

    currentWindow.style.left   = left + 'px';
    currentWindow.style.top    = top + 'px';
    currentWindow.style.width  = width + 'px';
    currentWindow.style.height = height + 'px';
    bodyElement.style.width    = bodyWidth - bordersWidth - innerPadding * 2 + 'px';
    bodyElement.style.height   = bodyHeight - headerHeight - innerPadding * 2 + 'px';

    currentWindow.setAttribute('prev-top', top+'px');
    currentWindow.setAttribute('prev-left', prevLeft+'px');
    bordersWrap.setAttribute('minimized-width', parseFloat(bordersWrap.offsetWidth));
    bordersWrap.setAttribute('minimized-height', parseFloat(bordersWrap.offsetHeight));
    
    mooveTitle(currentWindow);
    // console.log(currentWindow.querySelector(".window-top"));
    // console.log(height);
    // console.log(getUsableHeight());
    // console.log('currentWindow.style.top ' + top);
    
}

function minimizeWindow ({
    currentWindow = {},
    useBorders  = false,
    showBorders = true,
    skipLeft = false,
    ...rest
}) {
    unexpectedParams(rest);
    let bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
        bordersWrap = currentWindow.querySelector(".window-borders"),
        bodyElement = currentWindow.querySelector(".window-body"),
        innerPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--inner-padding')),
        headerHeight = parseFloat(currentWindow.querySelector(".window-top").offsetHeight),
        width  = parseFloat(currentWindow.getAttribute('minimized-width')),
        height = parseFloat(currentWindow.getAttribute('minimized-height')),
        left   = parseFloat(currentWindow.getAttribute('minimized-left')),
        top    = parseFloat(currentWindow.getAttribute('minimized-top')),
        right  = parseFloat(currentWindow.getAttribute('minimized-right')),
        bottom = parseFloat(currentWindow.getAttribute('minimized-bottom')),
        bodyMargin = parseFloat(currentWindow.getAttribute('body-margin')),
        bordersMinimizedWidth  = width,
        bordersMinimizedHeight = height,
        mainMargin = bordersWidth,
        bodyWidthDifference = mainMargin*2 + bodyMargin*2 + innerPadding*2,
        bodyHeightDifference = headerHeight + bordersWidth*2 + bodyMargin*2 + innerPadding*2;
    if ( !width )  width  = 250;
    if ( !height ) height = 250;
    if ( currentWindow.classList.contains("borders-hidden") && showBorders ) {
        bordersWrap.style.opacity = '';
        currentWindow.classList.remove("borders-hidden");
    }

    currentWindow.classList.remove("maximized");
    currentWindow.classList.remove("maximized-not-full");
    currentWindow.classList.add("minimized");

    if (!skipLeft) currentWindow.style.left   = (Number.isInteger(left) && !Number.isInteger(right) ) ? left   + 'px' : '';
    currentWindow.style.top    = (Number.isInteger(top)  && !Number.isInteger(bottom)) ? top    + 'px' : '';
    currentWindow.style.right  = (Number.isInteger(right))  ? right  + 'px' : '';
    currentWindow.style.bottom = (Number.isInteger(bottom)) ? bottom + 'px' : '';
    currentWindow.style.width  = width  + 'px';
    currentWindow.style.height = height + 'px';
    bodyElement.style.width    = width - bodyWidthDifference + 'px';
    bodyElement.style.height   = height - bodyHeightDifference + 'px';
    bodyElement.style.paddingBottom = '';
    bodyElement.style.margin   = '';
    bodyElement.style.paddingRight = '';
    bordersWrap.style.width  = bordersMinimizedWidth  + 'px';
    bordersWrap.style.height = bordersMinimizedHeight + 'px';
    mooveTitle(currentWindow);

    
    // console.log(event);
    // console.log(bodyHeightDifference);
    // console.log(bordersWidth);
    // console.log(bodyMargin);
}
//

// maximizing window, set inactive menu item
function showWindow ( element = {} ) {
    let windowElement = element.closest(".window-green"),
        transition = getComputedStyle(document.documentElement).getPropertyValue('--default-transition')
        // taskId = windowElement.getAttribute('task-id'),
        // elementInTaskBar = document.querySelectorAll(`.taskbar-item[task-id="${taskId}"]`)[0],
        // taskBarElementRect = elementInTaskBar.getBoundingClientRect(),
        // windowRect = windowElement.getBoundingClientRect()
    ;

    windowElement.style.top = windowElement.getAttribute('prev-top');
    windowElement.style.left = windowElement.getAttribute('prev-left');

    setTimeout(() => {
        windowElement.style.transition = '';
    }, parseFloat(transition) * 1000 + 1);

    transformAnimation({
        element: windowElement,
        transition: transition,
        transformFrom: 'scale(0)',
        transformTo:  'scale(1)',
        classToRemove: 'hidden'
    });
}
//

// showing ghost window for maximizing
let currentZindex = 5;

// remove ghost window for mouseup
function removeGhost ( id = 0 ) {
    let selector = `#ghost-window-${id}`,
        ghost = document.querySelector(selector),
        transition = getComputedStyle(document.documentElement).getPropertyValue('--fast-transition'),
        timeout = parseFloat(transition) * 1000 + 1;
    if ( ghost ) {
        ghost.style.transition = transition;
        ghost.style.width = 0;
        ghost.style.height = 0;
        ghost.style.opacity = 0;
        console.log(getComputedStyle(document.documentElement).getPropertyValue('--fast-transition'));
        console.log(timeout);
        ghost.style.left = ghost.getAttribute('mouse-position') + 'px';
        
        setTimeout(() => {
            if (document.querySelector(selector)) document.querySelector(selector).remove();
        }, timeout);
    }
}
//
function clearGhosts () {
    // if (document.querySelector(`#ghost-window-${ghostWindowId}`)) removeGhost(ghostWindowId);
    document.querySelectorAll(".ghost-window").forEach( item => item.remove() );
    ghostWindowId++;
}

let animations = {},
    animationProps = {};

function clearAnimationsObj () {
    for (const key in animations) {
        if (Object.hasOwnProperty.call(animations, key)) {
            const element = animations[key];
            // console.log(animations[key]);
            window.cancelAnimationFrame(animations[key]);
        }
    }
    animations = {};
}

function animateByPixel ({
    duration = 750, // ms
    HTMLelement = {},
    property = 'width',
    number   = 1
    }) {
    let start = performance.now();

    animations[property] = window.requestAnimationFrame(function animateByPixel(time) {
    // timeFraction от 0 до 1
        let timeFraction = (time - start) / duration,
            obj = animationProps[property];
        if (timeFraction > 1) timeFraction = 1;
        
        obj.timerID = animations[property];
        obj.timeLeft = Math.floor(duration - duration * timeFraction);
        obj.current = Math.round(obj.start + ( obj.end - obj.start ) * timeFraction);
        HTMLelement.style[property] = obj.start + ( obj.end - obj.start ) * timeFraction  + 'px';
        HTMLelement.setAttribute('time-left', obj.timeLeft);

        if (timeFraction < 1) {
            obj.timerID = animations[property] = window.requestAnimationFrame(animateByPixel);
        } else {
            HTMLelement.setAttribute('time-left', '0');
        }
    });
}

function cancelAnimateByPixel () {
    clearAnimationsObj();
    () => callback();
    return;
}

function showGhost ({
    id      = 0,
    toEnd   = false,
    instEnd = true,
    params  = {
        width  : { start: 0, end: 0 },
        height : { start: 0, end: 0 },
        top    : { start: 0, end: 0 },
        left   : { start: 0, end: 0 },
        bottom : { start: 0, end: 0 },
        right  : { start: 0, end: 0 },
    },
    toMaximize = {
        width  : NaN,
        height : NaN,
        top    : NaN,
        left   : NaN,
        bottom : NaN,
        right  : NaN,
    },
    classes = '',
    classesToDelete = '',
    ...rest
}) {
    for (const key in params) {
        let value = toMaximize[key];
        if (
            key === 'width' ||
            key === 'height' ||
            key === 'top' ||
            key === 'left' ||
            key === 'bottom' ||
            key === 'right'
        ) {
            for (const keyInner in params[key]) {
                if ( keyInner !== 'start' && keyInner !== 'end' ) {
                    unexpectedParams(params[key]);
                }
                if ( !params[key].hasOwnProperty('start') ) {
                    console.error(`'${key}' must have a 'start' property.`);
                    unexpectedParams(params[key]);
                }
            }
        } else {
            unexpectedParams(params);
        }
    }
    for (const key in toMaximize) {
        let value = params[key];
        if ( Number.isInteger(value) || Number.isNaN(value) ) {
            console.error(`'${key}' must be a Number or NaN.`);
            unexpectedParams(params);
        }
    }
    if ( classes !== '' ) classes = classes.replace(/[^a-zA-Z0-9-? ]/g, '');
    if ( classesToDelete !== '' ) classesToDelete = classesToDelete.replace(/[^a-zA-Z0-9-? ]/g, '');
    unexpectedParams(rest);
    let ghostMargin = parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--ghost-window-margin') );
    const setSizes = (element) => {
        // greenWidth  = (maxified.hasOwnProperty('width'))  ? maxified.width  : NaN,
        // greenHeight = (maxified.hasOwnProperty('height')) ? maxified.height : NaN,
        // greenLeft   = (maxified.hasOwnProperty('left'))   ? maxified.left   : NaN,
        // greenTop    = (maxified.hasOwnProperty('top'))    ? maxified.top    : NaN,
        // greenRight  = (maxified.hasOwnProperty('right'))  ? maxified.right  : NaN,
        // greenBottom = (maxified.hasOwnProperty('bottom')) ? maxified.bottom : NaN;
        element.setAttribute('green-width' , (toMaximize.hasOwnProperty('width'))  ? toMaximize.width  : NaN);
        element.setAttribute('green-height', (toMaximize.hasOwnProperty('height')) ? toMaximize.height : NaN);
        element.setAttribute('green-left'  , (toMaximize.hasOwnProperty('left'))   ? toMaximize.left   : NaN);
        element.setAttribute('green-top'   , (toMaximize.hasOwnProperty('top'))    ? toMaximize.top    : NaN);
        element.setAttribute('green-right' , (toMaximize.hasOwnProperty('right'))  ? toMaximize.right  : NaN);
        element.setAttribute('green-bottom', (toMaximize.hasOwnProperty('bottom')) ? toMaximize.bottom : NaN);
    };
    
    if ( document.querySelector(`#ghost-window-${id}`) !== null && !toEnd ) {
        let ghostWindowElement = document.querySelector('#ghost-window-'+id);
        if ( classesToDelete !== '' ) ghostWindowElement.classList.remove(classesToDelete);
        // console.log("toEnd === false; already exist");
        return;
    // when ghost exist and toEnd === true
    } else if ( document.querySelector(`#ghost-window-${id}`) !== null && toEnd ) {
        let ghostWindowElement = document.querySelector('#ghost-window-'+id),
            timeLeftToAnimate = parseFloat(ghostWindowElement.getAttribute('time-left'));
        if ( classesToDelete !== '' ) ghostWindowElement.classList.remove(classesToDelete);
        for (const key in params) {
            let value = params[key];
            if ( animationProps[key].end != params[key].end && instEnd === false ) {
                window.cancelAnimationFrame(animations[key]);
                animationProps[key].start = animationProps[key].current;
                animationProps[key].end = params[key].end;
                animationProps[key].current = 0;
                animateByPixel({ HTMLelement: ghostWindowElement, property: key, number: params[key].end });
            } else if ( timeLeftToAnimate > 0 ) {
                animationProps[key].end = params[key].end;
            } else {
                ghostWindowElement.style[key] = params[key].end +'px';
            }
            if ( !params[key].hasOwnProperty('end') ) ghostWindowElement.style[key] = params[key].start+'px';
        }
        setSizes(ghostWindowElement);
        return;
    }
    
    let ghostWindow = `
        <div id="ghost-window-${id}" class="ghost-window ${classes}"
            style="
                z-index: ${currentZindex - 2};
                left:   ${ (params.hasOwnProperty('left') && !params.hasOwnProperty('right') ) ? params.left.start : '' }px;
                top:    ${ (params.hasOwnProperty('top')  && !params.hasOwnProperty('bottom')) ? params.top.start  : '' }px;
                right:  ${ (params.hasOwnProperty('right') ) ? params.right.start  + 'px' : '' };
                bottom: ${ (params.hasOwnProperty('bottom')) ? params.bottom.start + 'px' : '' };
                width:  ${ (params.hasOwnProperty('width') ) ? params.width.start  + 'px' : '' };
                height: ${ (params.hasOwnProperty('height')) ? params.height.start + 'px' : '' };
            "
            mouse-position-start="${ (params.hasOwnProperty('left') && !params.hasOwnProperty('right') ) ? params.left.start : params.right.start}">
        </div>`
    ;
    document.querySelector("body").insertAdjacentHTML('beforeEnd', ghostWindow);
    let ghostWindowElement = document.querySelector('#ghost-window-'+id);

    if ( toEnd ) {
        animationProps = params;        
        for (const key in params) {
            if ( parseFloat(params[key].end) >= 0 ) animateByPixel({ HTMLelement: ghostWindowElement, property: key, number: params[key].end });
        }
        // console.log(animationProps);
        ghostWindowElement.classList.add('first-move');
    }
    setSizes(ghostWindowElement);
}

// minimum page size notification
function minimumPageSize () {
    const width = window.innerWidth,
    height = window.innerHeight;
    if ( width < 1528 || height < 500  ) {
        if ( !document.querySelector("#chage-size") ) {
            document.querySelector("body").insertAdjacentHTML('beforebegin', `
            <div id="chage-size"><span>This app requries minimum 1528x500px</span></div>
            `);
        }
    } else if ( document.querySelector("#chage-size") ) {
        document.querySelector("#chage-size").remove();
    }
}
//

// adjust all windows when full screen on||off
function checkWindowSize () {
    if ( !document.getElementById("transition-all") ) document.querySelector("head").insertAdjacentHTML('beforeend', `<style id="transition-all">* { transition: 0s !important; } </style>`);
    let allWindows = document.querySelectorAll(".window-green"),
        usableHeight = getUsableHeight(),
        bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
        windowHeadHeight = (document.querySelector(".window-head")) ? document.querySelector(".window-head").offsetHeight : 0;
    allWindows.forEach(function (event) {
        if ( event.classList.contains("maximized") ) {
            minimizeWindow({currentWindow: event, showBorders: true});
            maximizeWindow({currentWindow: event});
        } else if ( event.classList.contains("maximized-not-full") && parseFloat(event.offsetHeight) !== usableHeight || parseFloat(event.offsetHeight) > usableHeight ) {
            let currentWindow = event,bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
                bodyElement = currentWindow.querySelector(".window-body"),
                bordersWrap = currentWindow.querySelector(".window-borders"),
                usableHeight = getUsableHeight(),
                bodyMargin = parseFloat(window.getComputedStyle(bodyElement).margin),
                innerPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--inner-padding')),
                headerHeight = parseFloat(currentWindow.querySelector(".window-top").offsetHeight);
            bordersWrap.style.height = usableHeight + 'px';
            bodyHeight = usableHeight - bordersWidth - bodyMargin - innerPadding;
            currentWindow.style.height = usableHeight + 'px';
            bodyElement.style.height   = usableHeight - (headerHeight + bordersWidth*2 + bodyMargin*2 + innerPadding*2) + 'px';
        }
        if ( parseFloat(event.style.top) > usableHeight ) event.style.top = usableHeight - bordersWidth*2 - windowHeadHeight + 5 + 'px';
    });
    if (document.getElementById("task-list")) document.getElementById("task-list").style.maxHeight = getUsableHeight() - document.getElementById("open-tasks").offsetHeight + 'px';
    minimumPageSize();
    if ( document.querySelectorAll("#menu-wrap .visible")[0] ) initializeMenu();
    if ( document.getElementById("transition-all") ) document.getElementById("transition-all").remove();
}
window.onresize = checkWindowSize;
//

// moving window by drug heading,
let ghostWindowId = 0; // global variable for index of ghost windows
function windowsDraging ( windowHead = {} ) {
    function getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
    let currentWindow = windowHead.closest(".window-green");
    windowHead.onmousedown = function(event) {
        focusWindow(event.target.closest(".window-green"));
        let mouseDownEvent = event,
            coords = getCoords(currentWindow),
            inWindowX = event.pageX - coords.left,
            inWindowY = event.pageY - coords.top,
            ghostMargin = parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--ghost-window-margin') ),
            bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
            usableWidth = window.innerWidth,
            usableHeight = getUsableHeight(),
            ghostWidth = usableWidth - ghostMargin*2,
            ghostHeight = usableHeight- ghostMargin*2,
            ghostHalfWidth = Math.round(ghostWidth / 2 - ghostMargin),
            ghostHalfHeight = Math.round(ghostHeight / 2 - ghostMargin),
            posHalfBottom = Math.round(usableHeight - ghostHeight / 2 - ghostMargin),
            posHalfLeft = Math.round(usableWidth - ghostWidth / 2 - ghostMargin),
            needModal = false,
            taskbarOverlay = document.querySelector("#taskbar-overlay"),
            maximizeTop = 150,
            maximizeBottom = 150

        ;
        function moveAt(event) {
            currentWindow.style.left = event.pageX - inWindowX + 'px';
            currentWindow.style.top = event.pageY - inWindowY + 'px';
            currentWindow.setAttribute('prev-top', event.pageY - inWindowY + 'px');
            currentWindow.setAttribute('prev-left', event.pageX - inWindowX + 'px');
        }
        currentWindow.style.zIndex = currentZindex++; // z-index priority
        document.querySelector("html").style.userSelect = 'none';
        
        document.onmousemove = function(event) {
            // hanging "using" class while window dont get reset both positions outside usable area, and minimize when one position >= 0
            if ( parseFloat(currentWindow.style.top) >= 0 && parseFloat(currentWindow.style.left) >= 0 || parseFloat(currentWindow.style.top) >= 0 ) {
                currentWindow.classList.remove("using");
            }
            if ( currentWindow.classList.contains("maximized") ){
                if ( parseFloat(currentWindow.style.top) >= 0 || parseFloat(currentWindow.style.left) >= 0 ) {
                    let minimizedLeft = parseFloat(currentWindow.getAttribute('minimized-left')),
                        minimizedWidth = parseFloat(currentWindow.getAttribute('minimized-width')),
                        buttons = document.querySelector(".window-top-buttons"),
                        windowTopPadding = parseFloat(getComputedStyle(currentWindow.querySelector(".window-top")).getPropertyValue('padding'));
                        minimizedLeft = minimizedWidth/2;

                    if ( event.pageX - minimizedWidth/2 < 0 ) {
                        inWindowX -= bordersWidth;
                        if ( event.pageX < bordersWidth + windowTopPadding + buttons.offsetWidth ) inWindowX += bordersWidth;
                    } else if ( event.pageX + minimizedWidth/2 > usableWidth ) {
                        inWindowX = minimizedWidth/2 + (event.pageX + minimizedWidth/2 - usableWidth);
                        if ( event.pageX + bordersWidth > usableWidth ) inWindowX -= bordersWidth;
                    } else {
                        inWindowX = minimizedWidth/2;
                    }
                    minimizeWindow({
                        currentWindow: currentWindow,
                        showBorders: true
                    });
                } else if ( parseFloat(currentWindow.style.top) < 0 && parseFloat(currentWindow.style.left) < 0 || parseFloat(currentWindow.style.top) < 0 ) {
                    currentWindow.classList.add("using");
                }  
            } else if ( currentWindow.classList.contains("maximized-not-full") ){
                currentWindow.classList.remove("maximized-not-full");
            }
            //
            taskbarOverlay.style.zIndex = '9999';
            moveAt(event);
            // when mouse moves outside usable area
            if ( event.pageY < 0 ){ // top
                currentWindow.classList.add("maximize-in-full-screen");
                outsideAlert('Do it', ghostWindowId);
                windowHead.onmouseup();
                currentWindow.style.top = '0px';
                currentWindow.classList.remove("maximize-in-full-screen");
                console.log(currentWindow);
                // maximizeWindow({currentWindow: currentWindow});
            } else if ( event.pageY > innerHeight ){ // bottom when not full screen mode
                console.log(usableHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width'))*2 +
                document.querySelector(".window-head").offsetHeight + 5);
                currentWindow.style.top = 
                usableHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width'))*2 -
                document.querySelector(".window-head").offsetHeight + 5 + 'px';
                windowHead.onmouseup();
                outsideAlert('Mouse outside document', ghostWindowId);
            } else if ( event.target == taskbarOverlay ) { // bottom when inside browser but hovered at taskbar
                taskbarOverlay.style.cursor = 'pointer';
                taskbarOverlay.onmouseup = function(event) {
                    console.log(usableHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width'))*2 +
                    document.querySelector(".window-head").offsetHeight + 5);
                    currentWindow.style.top = 
                    usableHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width'))*2 -
                    document.querySelector(".window-head").offsetHeight + 5 + 'px';
                    windowHead.onmouseup();
                }
            }
            // blocking showGost if window not reseted after maximize
            if ( currentWindow.classList.contains("using") && parseFloat(currentWindow.style.top) <= bordersWidth ) return;
            // show ghost window when mouse close to outside
            if ( parseFloat(currentWindow.style.top) <= 0 ) { // top border
                if ( event.pageX < maximizeTop ) { // left
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: event.pageY, end: 0 },
                            left   : { start: event.pageX, end: 0 },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : 0,
                            left   : 0,
                        },
                        classesToDelete: 'use-full-size'
                    });
                } else if ( usableWidth - event.pageX < maximizeTop ) { // right
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: 0, end: 0 },
                            left   : { start: event.pageX, end: usableWidth-ghostWidth/2-ghostMargin },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : 0,
                            left   : usableWidth-ghostWidth/2-ghostMargin,
                        },
                        classesToDelete: 'use-full-size'
                    });
                    console.log('top right');
                } else { // middle
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostWidth },
                            height : { start: 0, end: ghostHeight },
                            top    : { start: 0, end: 0 },
                            left   : { start: event.pageX, end: 0 },
                        },
                        toMaximize: {
                            width  : usableWidth + bordersWidth*2,
                            height : usableHeight + bordersWidth*2,
                            top    : -bordersWidth,
                            left   : -bordersWidth,
                        },
                        classes: 'use-full-size'
                    });
                }
            } else if ( event.pageX < 5 ) { // left border
                let left = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageX : 0,
                    topBottom = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageY: usableHeight - ghostHeight/2 - ghostMargin,
                    top = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageY : 0;
                if ( event.pageY < maximizeTop ) { // top
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: event.pageY, end: 0 },
                            left   : { start: event.pageX, end: 0 },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : 0,
                            left   : 0,
                        }
                    });
                } else if ( usableHeight - event.pageY < maximizeTop ) { // bottom
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: event.pageY, end: posHalfBottom },
                            left   : { start: event.pageX, end: 0 },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : usableHeight - ghostHeight / 2 + 2,
                            left   : 0,
                        }
                    });
                    console.log('left bottom');
                } else { // middle
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHeight },
                            top    : { start: event.pageY, end: 0 },
                            left   : { start: 0, end: 0 },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : usableHeight,
                            top    : 0,
                            left   : 0,
                        }
                    });
                    console.log('left mid');
                }
            } else if ( event.pageX + 5 > usableWidth ) { // right border
                let topBottom = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageY: usableHeight - ghostHeight/2-ghostMargin,
                    top = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageY : 0,
                    left = (document.querySelector(`#ghost-window-${ghostWindowId}`) == null) ? event.pageX : usableWidth - ghostWidth/2-ghostMargin;
                if ( event.pageY < maximizeTop ) { // top
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: event.pageY, end: 0 },
                            left   : { start: event.pageX, end: posHalfLeft },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : 0,
                            left   : posHalfLeft,
                        }
                    });
                } else if ( usableHeight - event.pageY < maximizeTop ) { // bottom
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHalfHeight },
                            top    : { start: event.pageY, end: posHalfBottom },
                            left   : { start: event.pageX, end: posHalfLeft },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : Math.round(ghostHeight / 2),
                            top    : usableHeight - ghostHeight / 2 + 2,
                            left   : posHalfLeft,
                        }
                    });
                } else { // middle
                    showGhost({
                        id    : ghostWindowId,
                        toEnd : true,
                        instEnd: false,
                        params: {
                            width  : { start: 0, end: ghostHalfWidth },
                            height : { start: 0, end: ghostHeight },
                            top    : { start: event.pageY, end: 0 },
                            left   : { start: event.pageX, end: posHalfLeft },
                        },
                        toMaximize: {
                            width  : Math.round((ghostWidth / 2) + ghostMargin),
                            height : usableHeight,
                            top    : 0,
                            left   : posHalfLeft,
                        }
                    });
                }
            } else {
                clearGhosts();
            }
        }
        windowHead.onmouseup = function() {
            document.onmousemove = null;
            document.querySelector("html").style.userSelect = '';
            currentWindow.onmouseup = null;
            taskbarOverlay.onmouseup = null;
            taskbarOverlay.style.zIndex = '';
            if ( taskbarOverlay.style.cursor == 'pointer' ) taskbarOverlay.style.cursor = '';
            if ( currentWindow.classList.contains("maximized") && parseFloat(currentWindow.style.top) <= bordersWidth ) {
                currentWindow.style.top = '-' + bordersWidth + 'px';
                currentWindow.style.left = '-' + bordersWidth + 'px';
                currentWindow.classList.remove("using");
                return;
            }
            if (parseFloat(currentWindow.style.top) < 0) currentWindow.style.top = '0px';
            if ( document.querySelectorAll(".ghost-window")[0] && !currentWindow.classList.contains("maximize-in-full-screen") ) maximizeWindow({currentWindow: currentWindow, useSizeFromGreen: true, useFullSize: false});
            clearGhosts();
            cancelAnimateByPixel();
        }
    }
    windowHead.ondragstart = function() {
        console.log(1);
    }
}
//

// 
function mooveTitle( currentWindow = {} ) {
    const headWidth    = currentWindow.querySelector(".window-head").offsetWidth,
        buttonsWidth = currentWindow.querySelector(".window-top-buttons").offsetWidth,
        title        = currentWindow.querySelector(".wh-header"),
        titleWidth   = title.offsetWidth,
        titleMargin  = title.offsetLeft;
        // console.log('123');
    if ( buttonsWidth + titleWidth + titleMargin >= headWidth ) {
        title.style.marginLeft = buttonsWidth + 'px';
    } else {
        title.style.marginLeft = '';
    }
}

// hadler for all borders to resize
const borders = {
    "window-border-top": {
        persClass: "window-border-top",
        borderX: false,
        borderY: true,
        moveX: false,
        moveY: true,
        isPositive: true
    },
    "window-border-top-right" : {
        persClass: "window-border-top-right",
        borderX: false,
        borderY: true,
        moveX: false,
        moveY: true,
        isPositive: true
    },
    "window-border-right": {
        persClass: "window-border-right",
        borderX: true,
        borderY: false,
        moveX: false,
        moveY: false,
        isPositive: false
    },
    "window-border-bottom": {
        persClass: "window-border-bottom",
        borderX: false,
        borderY: true,
        moveX: false,
        moveY: false,
        isPositive: false
    },
    "window-border-bottom-left": {
        persClass: "window-border-bottom-left",
        borderX: false,
        borderY: true,
        moveX: false,
        moveY: false,
        isPositive: false
    },
    "window-border-left": {
        persClass: "window-border-left",
        borderX: true,
        borderY: false,
        moveX: true,
        moveY: false,
        isPositive: true
    },
    "window-border-top-left": {
        persClass: "window-border-top-left",
        borderX: true,
        borderY: true,
        moveX: true,
        moveY: true,
        isPositive: true
    },
    "window-border-bottom-right": {
        persClass: "window-border-bottom-right",
        borderX: true,
        borderY: true,
        moveX: false,
        moveY: false,
        isPositive: false
    }
};

document.onmousedown = function(event) {
    Object.keys(borders).forEach(function(persClass) {
        if (
            !event.target.classList.contains(persClass) 
        ) {
            return false;
        }
    function getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }
    // borderObj.element.onmousedown = function(event) {
        let borderObj = borders[persClass],
            mouseDownEvent = event,
            currentWindow = event.target.closest(".window-green"),
            bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
            taskbarOverlay = document.querySelector("#taskbar-overlay"),
            ghostMargin = parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--ghost-window-margin') ),
            usableWidth = window.innerWidth,
            usableHeight = getUsableHeight(),
            defaultGhostW = usableWidth - ghostMargin*2,
            defaultGhostH = usableHeight - ghostMargin*2,
            clickposStartTop = event.y,
            clickposStartLeft = event.x,
            windowStartTop = parseFloat(currentWindow.style.top),
            windowStartLeft = parseFloat(currentWindow.style.left),
            posInWindowY = clickposStartTop - windowStartTop,
            posInWindowX = clickposStartLeft - windowStartLeft,
            windowWidth = currentWindow.offsetWidth,
            windowHeight = currentWindow.offsetHeight,
            bordersElement = currentWindow.querySelector(".window-borders"),
            windowBodyElement = currentWindow.querySelector(".window-body"),
            coords = getCoords(currentWindow),
            inWindowX = event.pageX - coords.left,
            inWindowY = event.pageY - coords.top,
            windowBodyHeight = windowBodyElement.clientHeight - 2*parseFloat(getComputedStyle(windowBodyElement).getPropertyValue('padding')),
            windowBodyWidth = windowBodyElement.offsetWidth - 2*parseFloat(getComputedStyle(windowBodyElement).getPropertyValue('padding')),
            taskBarHeigth = taskbarOverlay.offsetHeight,
            counter = 300,
            posLeftMinWidth = windowStartLeft + (windowWidth - 250),
            posTopMinWidth = windowStartTop + (windowHeight - 250)
        ;
        
        document.querySelector("html").style.userSelect = 'none'; 
        taskbarOverlay.style.zIndex = '9999';

        function moveAt( event, moveX, moveY ) {
            if (moveX) currentWindow.style.left = event.pageX - inWindowX + 'px';
            if (moveY) currentWindow.style.top = event.pageY - inWindowY + 'px';
            if (moveX) currentWindow.setAttribute('prev-left', event.pageX - inWindowX + 'px');
            if (moveY) currentWindow.setAttribute('prev-top', event.pageY - inWindowY + 'px');
        }

        function changeSize( event, borderObj ) {
            let borderX         = borderObj.borderX,
                borderY         = borderObj.borderY,
                isPositive      = borderObj.isPositive,
                diffX           = clickposStartLeft - event.pageX,
                diffY           = clickposStartTop - event.pageY;
            function changeWidth( innerWidth = usableWidth, outerWidth = usableWidth - (windowWidth - windowBodyWidth), plusOrMinus = '' ) {
                mooveTitle(currentWindow);
                if ( plusOrMinus === '-' ) {
                    innerWidth -= diffX;
                    outerWidth -= diffX;
                } else if ( plusOrMinus === '+' ) {
                    innerWidth += diffX;
                    outerWidth += diffX;
                }
                currentWindow.style.width = innerWidth + 'px';
                bordersElement.style.width = innerWidth + 'px';
                windowBodyElement.style.width = outerWidth + 'px';
            }
            function changeHeight( innerHeight = usableHeight, outerHeight = usableHeight - (windowHeight - windowBodyHeight), plusOrMinus = '' ) {
                if ( plusOrMinus === '-' ) {
                    innerHeight -= diffY;
                    outerHeight -= diffY;
                } else if ( plusOrMinus === '+' ) {
                    innerHeight += diffY;
                    outerHeight += diffY;
                }
                currentWindow.style.height = innerHeight + 'px';
                bordersElement.style.height = innerHeight + 'px';
                windowBodyElement.style.height = outerHeight + 'px';
            }
            bordersElement.style.transition = '0s';
            windowBodyElement.style.transition = '0s';
            
            // first option (non reviewed), looks readable
            if ( borderObj.persClass == 'window-border-left' && windowWidth + diffX >= usableWidth
              || borderObj.persClass == 'window-border-top' && windowHeight + diffY >= usableHeight
              || borderObj.persClass == 'window-border-top-left' && windowWidth + diffX >= usableWidth && windowHeight + diffY >= usableHeight
              || borderObj.persClass == 'window-border-left' && windowWidth + diffX <= 250
              || borderObj.persClass == 'window-border-top' && windowHeight + diffY <= 250
              || borderObj.persClass == 'window-border-top-left' && windowWidth + diffX <= 250 && windowHeight + diffY <= 250
               ) {
                return;
            } else if ( borderObj.persClass == 'window-border-top-left' && windowWidth + diffX >= usableWidth
                     || borderObj.persClass == 'window-border-top-left' && windowWidth + diffX <= 250 ) {
                if ( event.pageY >= parseFloat(currentWindow.style.top) && windowHeight + diffY <= 250 ) return;
                moveAt(event, false, borderObj.moveY);
                if ( windowWidth + diffX < usableWidth ) currentWindow.style.left = posLeftMinWidth + 'px';
            } else if ( borderObj.persClass == 'window-border-top-left' && windowHeight + diffY >= usableHeight
                     || borderObj.persClass == 'window-border-top-left' && windowHeight + diffY <= 250 ) {
                moveAt(event, borderObj.moveX, false);
                if ( windowHeight + diffY < usableHeight ) currentWindow.style.top = posTopMinWidth + 'px';
            } else {
                moveAt(event, borderObj.moveX, borderObj.moveY);
            }
            // second reviewed, but looks not readable. which one is better?
            // if ( borderObj.persClass == 'window-border-left' ) {
            //     if ( windowWidth + diffX >= usableWidth || windowWidth + diffX <= 250 ) return;
            //     moveAt(event, borderObj.moveX, borderObj.moveY);
            // } else if ( borderObj.persClass == 'window-border-top' ) {
            //     if ( windowHeight + diffY >= usableHeight || windowHeight + diffY <= 250 ) return;
            //     moveAt(event, borderObj.moveX, borderObj.moveY);
            // } else if ( borderObj.persClass == 'window-border-top-left' ) {
            //     if ( windowWidth + diffX >= usableWidth && windowHeight + diffY >= usableHeight || windowWidth + diffX <= 250 && windowHeight + diffY <= 250 ) {
            //         return;
            //     } else if ( windowWidth + diffX >= usableWidth || windowWidth + diffX <= 250 ) {
            //         if ( event.pageY >= parseFloat(currentWindow.style.top) && windowHeight + diffY <= 250 ) return;
            //         moveAt(event, false, borderObj.moveY);
            //     } else if ( windowHeight + diffY >= usableHeight || windowHeight + diffY <= 250 ) {
            //         moveAt(event, borderObj.moveX, false);
            //     } else {
            //         moveAt(event, borderObj.moveX, borderObj.moveY);
            //     }
            // } else {
            //     moveAt(event, borderObj.moveX, borderObj.moveY);
            // }
            if ( borderX && isPositive ) {
                if ( windowWidth + diffX > usableWidth ) {
                    changeWidth();
                } else if ( windowWidth + diffX <= 250 ) {
                    changeWidth(250, 178);
                console.log('2');
                } else {
                    changeWidth(windowWidth, windowBodyWidth, '+');
                }
            } else if ( borderX && !isPositive ) {
                if ( windowWidth - diffX > usableWidth ) {
                    changeWidth();
                console.log('1');
                } else if ( windowWidth - diffX <= 250 ) {
                    changeWidth(250, 178);
                console.log('2');
                } else {
                    changeWidth(windowWidth, windowBodyWidth, '-');
                console.log('3');
                }
            }
            if ( borderY && isPositive ) {
                if ( windowHeight + diffY > usableHeight  ) {
                    changeHeight();
                } else if ( windowHeight + diffY <= 250 ) {
                    changeHeight(250, 152);
                } else if ( usableHeight + 100 > parseFloat(currentWindow.offsetHeight) ) {
                    changeHeight(windowHeight, windowBodyHeight, '+');
                }
            } else if ( borderY && !isPositive ) {
                if ( windowHeight - diffY > usableHeight ) {
                    changeHeight();
                } else if ( windowHeight - diffY <= 250 ) {
                    changeHeight(250, 152);
                } else {
                    changeHeight(windowHeight, windowBodyHeight, '-');
                }
            }
        }

        focusWindow(event.target.closest(".window-green"));
        // currentWindow.style.zIndex = currentZindex++; // z-index priority
        // console.log();
        document.onmousemove = function(event) {
            let clickedClass = mouseDownEvent.target.classList[0],
                windowTop = parseFloat(currentWindow.style.top),
                windowLeft = parseFloat(currentWindow.style.left),
                pxsToTaskBar = usableHeight - windowTop - currentWindow.offsetHeight,
                windowWidth = currentWindow.offsetWidth;
            document.querySelector("html").style.cursor = getComputedStyle(mouseDownEvent.target).getPropertyValue('cursor');
            if ( event.pageY < 1 && currentWindow.offsetHeight > 250 && currentWindow.offsetHeight >= usableHeight
                || event.pageY < 1 && currentWindow.classList.contains("maximized-not-full") ) { 
                // when mouse moove fast to top border, position.top cant keep up for event.pageY, this is solution
                currentWindow.style.top = '0px';
                currentWindow.style.height = usableHeight + 'px';
                bordersElement.style.height = usableHeight + 'px';
                windowBodyElement.style.height = windowBodyHeight + 'px';
                console.log('workArea.onmouseleave !!!');
            }
            if ( event.pageY < 0 ) {
                if ( currentWindow.offsetHeight >= usableHeight ) {
                    currentWindow.style.height = parseFloat(currentWindow.style.height) + windowTop + 'px';
                    bordersElement.style.height = parseFloat(bordersElement.style.height) + windowTop + 'px';
                    windowBodyElement.style.height = parseFloat(windowBodyElement.style.height) + windowTop + 'px';
                    currentWindow.style.top = '0px';
                }
                document.onmouseup();
                document.querySelector("html").style.userSelect = '';
                outsideAlert('Do more', ghostWindowId);
            } else {
                changeSize(event, borderObj);
            }

            if ( windowStartTop < 1 && currentWindow.classList.contains("maximized-not-full") ) return;
            if ( windowTop <= 0 && clickedClass === 'window-border-top-left' ) {
                // top left corner
                console.log('top left corner');
                console.log(usableWidth - windowLeft);
                windowLeft  = parseFloat(currentWindow.style.left);
                windowWidth = currentWindow.offsetWidth;
                let topObj     = { start: ghostMargin },
                    leftObj    = { start: windowLeft - 2 },
                    widthObj   = { start: 0, end: windowWidth },
                    toMaxWidth = windowWidth;
                    toMaxLeft  = windowLeft;
                if ( windowLeft + windowWidth >= usableWidth ) windowWidth = usableWidth - windowLeft - ghostMargin;
                if ( windowLeft <= ghostMargin ) {
                    topObj     = { start: event.pageY, end: ghostMargin };
                    leftObj    = { start: event.pageX, end: ghostMargin },
                    widthObj   = { start: 0, end: windowWidth + windowLeft - ghostMargin - 2 };
                    toMaxWidth =  windowWidth + windowLeft - ghostMargin - 2;
                    toMaxLeft  = windowLeft;
                }
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : widthObj,
                        height : { start: 0, end: defaultGhostH },
                        top    : topObj,
                        left   : leftObj,
                    },
                    toMaximize: {
                        width  : toMaxWidth,
                        height : usableHeight,
                        top    : 0,
                        left   : toMaxLeft,
                    },
                });
            } else if ( windowLeft <= 0 && clickedClass === 'window-border-top-left' ) {
                // top left corner at left side
                console.log('top left corner on left border');
                console.log(usableWidth - windowLeft);
                // let rightStart = usableWidth - windowLeft - windowWidth - 2;
                if ( windowLeft + windowWidth >= usableWidth ) windowWidth = usableWidth - windowLeft - ghostMargin;
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth + windowLeft - ghostMargin - 2 },
                        height : { start: 0, end: defaultGhostH },
                        top    : { start: event.pageY, end: ghostMargin },
                        left   : { start: windowLeft, end: ghostMargin },
                    },
                    toMaximize: {
                        width  : windowWidth + windowLeft - ghostMargin - 2,
                        height : usableHeight,
                        top    : 0,
                        left   : windowLeft,
                    },
                });
            } else if ( windowTop <= 0 && clickedClass === 'window-border-top' ||
                        windowTop <= 0 && clickedClass === 'window-border-top-right' 
            ) { // top border
                // console.log('top border');
                let leftEnd = windowLeft - 2;
                if ( leftEnd < 0 ) leftEnd = ghostMargin;
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth },
                        height : { start: 0, end: defaultGhostH },
                        top    : { start: event.pageY, end: ghostMargin },
                        left   : { start: event.pageX, end: leftEnd },
                    },
                    toMaximize: {
                        height : usableHeight,
                        top    : 0,
                        left   : leftEnd,
                    },
                });
            } else if ( pxsToTaskBar <= 0 && clickedClass === 'window-border-bottom' ||
                        pxsToTaskBar <= 0 && clickedClass === 'window-border-bottom-left'
            ) { // bottom border
                console.log('bottom border');
                let end = windowLeft - 2;
                if ( end < 0 ) end = ghostMargin;
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth },
                        height : { start: 0, end: defaultGhostH },
                        top    : { start: event.pageY, end: ghostMargin },
                        left   : { start: event.pageX, end: end },
                    },
                    toMaximize: {
                        height : usableHeight,
                        top    : 0,
                        left   : end,
                    },
                });
            } else if ( pxsToTaskBar <= 0 && clickedClass === 'window-border-bottom-right' ) {
                // bottom right corner
                console.log('bottom right corner');
                windowLeft  = parseFloat(currentWindow.style.left);
                windowWidth = currentWindow.offsetWidth;
                let ghostRight = usableWidth - windowLeft - windowWidth - 2,
                    windowOutsidePxs = usableWidth - (currentWindow.offsetWidth + parseFloat(currentWindow.style.left)),
                    toMaxWidth = currentWindow.offsetWidth;
                if ( windowLeft < 0 ) windowWidth += windowLeft - ghostMargin;
                if ( usableWidth - windowLeft - windowWidth - 2 <= ghostMargin ) {
                    toMaxWidth = currentWindow.offsetWidth + (usableWidth - (currentWindow.offsetWidth + parseFloat(currentWindow.style.left)));
                    windowWidth = windowWidth + windowOutsidePxs - ghostMargin - 2 ;
                    ghostRight = ghostMargin,
                console.log(usableWidth - windowLeft - windowWidth - 2);
                }
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth },
                        height : { start: 0, end: defaultGhostH },
                        // ** this way to show ghost instantly from right border (mouse position with mooving), like it works at top right corner
                        bottom : { start: taskBarHeigth },
                        right  : { start: ghostRight },
                        // **
                        // // this is main way to show ghost but it showing ghost slow and only from strting mouse position
                        // top    : {
                        //     start: usableHeight,
                        //     end: ghostMargin
                        // },
                        // left   : {
                        //     start: parseFloat(currentWindow.style.left) + currentWindow.offsetWidth,
                        //     end  : parseFloat(currentWindow.style.left) - 2
                        // },
                    },
                    toMaximize: {
                        width  : toMaxWidth,
                        height : usableHeight,
                        top    : 0
                    }
                });
            } else if ( usableWidth - (windowWidth + windowLeft) <= 0 && clickedClass === 'window-border-bottom-right' ) {
                // bottom right corner at right side
                console.log('bottom right corner at right side');
                windowLeft  = parseFloat(currentWindow.style.left);
                let windowOutsidePxs = usableWidth - (currentWindow.offsetWidth + parseFloat(currentWindow.style.left)),
                    toMaxWidth = currentWindow.offsetWidth + (usableWidth - (currentWindow.offsetWidth + parseFloat(currentWindow.style.left))),
                    ghostBottomStart = usableHeight + taskBarHeigth - ghostMargin - 2 - (parseFloat(currentWindow.style.top) + currentWindow.offsetHeight);
                windowWidth = windowWidth + windowOutsidePxs - ghostMargin - 2 ;
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth },
                        height : { start: 0, end: defaultGhostH },
                        // ** this way to show ghost instantly from right border (mouse position with mooving), like it works at top right corner
                        bottom : { start: ghostBottomStart, end: taskBarHeigth },
                        right  : { start: ghostMargin },
                        // **
                        // // this is main way to show ghost but it showing ghost slow and only from strting mouse position
                        // top    : {
                        //     start: event.pageY - currentWindow.offsetHeight, end: usableHeight,
                        //     end  : ghostMargin
                        // },
                        // left   : {
                        //     start: parseFloat(currentWindow.style.left) + currentWindow.offsetWidth,
                        //     end  : parseFloat(currentWindow.style.left) - 2
                        // },
                    },
                    toMaximize: {
                        width  : toMaxWidth,
                        height : usableHeight,
                        top    : 0
                    }
                });
            } else if ( windowLeft < 1 && clickedClass === 'window-border-left' ) {
                // left border
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth + windowLeft - ghostMargin - 2 },
                        height : { start: 0, end:   defaultGhostH },
                        top    : { start: event.pageY, end:   ghostMargin },
                        left   : { start: ghostMargin }, // minimizing by use string in prop
                    },
                    toMaximize: {
                        width  : currentWindow.offsetWidth + parseFloat(currentWindow.style.left),
                        height : usableHeight,
                        top    : 0,
                        left   : 0,
                    }
                });
            } else if (  windowLeft + windowWidth + 3 > usableWidth && clickedClass === 'window-border-right' ) {
                // right border
                showGhost({
                    id    : ghostWindowId,
                    toEnd : true,
                    params: {
                        width  : { start: 0, end: windowWidth - ghostMargin + (usableWidth - windowWidth - windowLeft) - 2 },
                        height : { start: 0, end: defaultGhostH },
                        top    : { start: event.pageY, end:   ghostMargin },
                        right  : { start: ghostMargin }, // minimizing by use string in prop
                    },
                    toMaximize: {
                        width  : currentWindow.offsetWidth + (usableWidth - (currentWindow.offsetWidth + parseFloat(currentWindow.style.left))),
                        height : usableHeight,
                        top    : 0
                    }
                });
            } else  {
                clearGhosts();
            }
        }
        document.onmouseup = function() {
            // console.log(1111111111);
            if ( document.getElementById("style-to-all") ) document.getElementById("style-to-all").remove();
            document.onmousemove = null;
            document.onmouseup = null;
            firstTarget = '';
            if ( parseFloat(currentWindow.style.top) < 0 ) currentWindow.style.top = '0px';
            if ( document.querySelectorAll(".ghost-window")[0] ) maximizeWindow({currentWindow: currentWindow, useSizeFromGreen: true, useFullSize: false});
            clearGhosts();
            setTimeout(() => {
                bordersElement.style.transition = '';
                windowBodyElement.style.transition = '';
            }, 10);
            document.querySelector("html").style.cursor = '';
            taskbarOverlay.style.zIndex = '';
            cancelAnimateByPixel();
            return false;
        }
    });

    document.ondragstart = function() {
        return false;
    }
}

function outsideAlert( message = 'Your mouse outside document, switch to fullscren mode?', id = 1,  ) {
    if ( !window.screenTop && !window.screenY ) {
        setTimeout(() => {
            // removeGhostWindow(ghostWindowId);
            clearGhosts();
            if ( !window.screenTop && !window.screenY && confirm(message) ) document.documentElement.requestFullscreen();
        }, 10);
    }
}


//

// main menu opening
function toggleMainMenu ( event = {} ) {
    let menuWrap = document.getElementById("menu-wrap");
    if ( !menuWrap.classList.contains("blocked") ) {
        if ( menuWrap.classList.contains("active") ) {
            menuWrap.classList.remove("active");
            menuWrap.style.left = '30px';
            document.getElementById("button-toggle").style.top = '0';
        } else if ( menuWrap.querySelector(".task-list-item") && menuWrap.querySelectorAll(".visible")[0] ) {
            menuWrap.classList.add("active");
            menuWrap.style.left = '21px';
            document.getElementById("button-toggle").style.top = '-1.7em';
        }
    }
    blockClicked( menuWrap, 750);
    blockClicked( document.getElementById("open-tasks"), 750);
    blockClicked( document.getElementById("menu-wrap"), 750);
};
// hang menu opening
forEachClick({
    selector: "#open-tasks",
    func: toggleMainMenu,
    needTimeOut: true,
    secTimeOut: parseFloat( getComputedStyle(document.documentElement).getPropertyValue('--default-transition') ) * 1000,
    selectorToBlocked: "#menu-wrap"
    });
//

// main menu closing
function closeMainMenu ( event = {} ) {
    let menuWrap = document.getElementById("menu-wrap");
    
    menuWrap.classList.remove("active");
    menuWrap.style.left = '30px';
    document.getElementById("button-toggle").style.top = '0';
};

setOutsideClick ('#menu-wrap', '#menu-wrap', closeMainMenu);

//

// set margins inside taskbar
function setTasksMargin ( elementToRemove = {} ) {
    let taskbarItems = document.querySelectorAll(".taskbar-item"),
        taskbarItemsCount = taskbarItems.length,
        taskbarItemsWidth = [...taskbarItems].reduce( (prev, current) => prev + current.offsetWidth, 0 ) ,
        taskbarInnerWidth = document.getElementById("taskbar-inner").clientWidth,
        itemsMargin = (taskbarInnerWidth - taskbarItemsWidth) / ( 2*taskbarItemsCount )
    ;

    itemsMargin < 10 ? itemsMargin = 10 : false;

    let reduce = [...taskbarItems].reduce( (left, current) => {
        current.style.left = `${left}px`;
        return left + current.offsetWidth + itemsMargin*2;
    
    }, itemsMargin );
}
//

// moving menu to starting position
function initializeMenu () {
    let menuWrap = document.getElementById("menu-wrap"),
        menuListHeight = document.getElementById("task-list").clientHeight
    ;
    menuWrap.style.bottom = `-${menuListHeight + 3}px`;
}
//

// window focus in
function focusInWindow ( element = {}) {
    if ( element.classList.contains("active") ) return;
    element.classList.add("active");
    element.style.zIndex = currentZindex++;
}
//

// window focus out
function focusOutWindow ( activeElement = {} ) {
    if ( document.querySelector(".window-green.active") ) document.querySelector(".window-green.active").classList.remove("active");
}
//

// activate task in taskbar
function activateTaskInTaskbar ( elementAttribute = '' ) {
    let element = document.querySelector(`.taskbar-item[task-id="${elementAttribute}"]`);
    if ( element ) {
        element.classList.add("active");
    } else {
        console.error('U dont have task on taskbar to activate!');
    }
}
//

// remove class "active" from elemen with 'selector'
function deactivate ( selector = '' || {} ) {

    if ( typeof selector === "string" ) {
        let activeItem = document.querySelector(selector);
        if ( activeItem ) {
            activeItem.classList.remove('active');
        }
    } else if ( typeof selector === "object" ) {
        selector.classList.remove('active');
    } else {
        console.error('Use me better, i know u can!');
    }
}
//

// doing focus on window
function focusWindow ( element = {} , event ) {
    // console.log('++ to window');
    let activeElement = document.querySelector(".window-green.active");

    if (activeElement) focusOutWindow(activeElement);
    deactivate('.taskbar-item.active');
    if ( event ) {
        if ( event.target.classList.contains('window-hide') ||
             event.target.classList.contains('hide-1') ||
             event.target.classList.contains('hide-2') ||
             event.target.classList.contains('window-close') ||
             event.target.classList.contains('close-line1') ||
             event.target.classList.contains('close-line2')
            ) {
            return;

        }
    }
    if ( element.classList.contains("active") ) {
        return false;
    }
    activateTaskInTaskbar(element.getAttribute('task-id'));
    focusInWindow(element);

}
//

// focusing window from click on taskbar element
function clickTaskAtTaskBar ( element = {} ) {
    let window = document.querySelector(`.window-green[task-id="${element.getAttribute('task-id')}"]`),
        transition = getComputedStyle(document.documentElement).getPropertyValue('--default-transition');
    if ( window.classList.contains("hidden") && !window.classList.contains("blocked") ) {
        blockClicked(element, parseFloat(transition) * 1000 + 1);
        showWindow(window);
    } else if ( element.classList.contains("active") && window.classList.contains("active") && !window.classList.contains("blocked") ) {
        blockClicked(element, parseFloat(transition) * 1000 + 1);
        hideWindow(window);
        return false;
    }
    focusWindow(window);
}
//

// imagine this is responses like graphQL (but in files)
const jsonMenuItemsData = JSON.parse(jsonMenuItemsResponse);
const jsonWindowItemsData = JSON.parse(jsonWindowItemsResponse); // here all results for simple adding new data in file
//

// creating menu items from "service" response
function spawnMenuItems ( jsonMenuItems = {} ) {
    let menuElement = document.getElementById("task-list");
    if (jsonMenuItems) {
        for (let key in jsonMenuItems) {
            let menuItem = `
                <li class="task-list-item visible" task-name="${jsonMenuItems[key].name}"  task-id="${jsonMenuItems[key].id}">
                    <div class="task-list-link">${jsonMenuItems[key].name}</div>
                    <div class="task-data">
                    </div>
                </li>
                `;
            menuElement.insertAdjacentHTML('beforeEnd', menuItem);
        }
    } else {
        console.error('jsonMenuItems.tasks is empty');
    }
    // moving menu to starting position
    initializeMenu();
    // hang window handler on taskbar items
    
forEachClick( {selector: ".task-list-item",func: spawnWindow} );
}
//

// function to call new window from existed
function callNewFromExisted( taskId = 0, event ) {
    setTimeout(() => {
        taskId = event.target.getAttribute('window-id-to-call');
        spawnWindow( document.querySelector(`.task-list-item[task-id="${taskId}"]`), false );
    }, 1);
}
//

// hidding menu item after click
function hideMenuItem ( element = {}, menu = {} ) {
    let styles = window.getComputedStyle(element),
        elementFullHeight = element.offsetHeight + parseFloat(styles.marginTop),
        menuBottom = parseFloat(menu.style.bottom) + elementFullHeight - 2,
        menuTransition = menu.style.transition;
    ;
    element.style.transition = '0.75s';
    element.style.height = element.clientHeight + 'px';
    menu.style.bottom = menuBottom + 'px';
    // menu.style.bottom = -3 - parseFloat(document.getElementById("task-list").offsetHeight) + 'px';

    element.classList.add('hidden');
    element.classList.remove('visible');
    function animation1() {
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.overflow = 'hidden';
                element.style.margin = '0px';
                element.style.transform = 'scale(0)'; 
                element.style.height = '0';
                menu.style.transition = '1s';
                document.getElementById('open-tasks').click();
                // console.log('a');
                resolve("animation1!");
            }, 0);
        });
    }
    function animation2() {
        return new Promise(resolve => {
            setTimeout(() => {
                menu.style.transition = menuTransition;
                // console.log('b');
                resolve("animation2!");
            }, 750);
        });
    }
    function animation3() {
        return new Promise(resolve => {
            if ( menu.getElementsByTagName('ul')[0].getElementsByTagName('li').length == menu.getElementsByTagName('ul')[0].querySelectorAll(".hidden").length ) {
                console.log('No tasks');
                let menuStyles = window.getComputedStyle(menu),
                    menuML = menuStyles.marginLeft;
                
                setTimeout(() => {
                    menu.style.marginLeft = menuML;
                }, 0);
                setTimeout(() => {
                    menu.style.bottom = '-500px';
                    document.getElementById("taskbar").style.right = (window.innerWidth - document.getElementById('taskbar').offsetWidth) / 2 + 'px';
                    document.getElementById("taskbar").style.transition = '1s';
                }, 10);
                    console.log(menuML);
            }
            
            resolve("animation3!");
        });
    }

    async function animateAll() {
        let result1 = await animation1(),
            result2 = await animation2(),
            result3 = await animation3();
    }
    animateAll();

}


// spawn window on click menu item
function spawnWindow ( element = {}, hideMenu = true ) {
    console.log(jsonWindowItemsData);
    let taskId = element.getAttribute('task-id'),
        menuBox = document.getElementById('menu-wrap'),
        windowData = jsonWindowItemsData[taskId], // like response
        functionsToInit = windowData.functionsToInit,
        transition = getComputedStyle(document.documentElement).getPropertyValue('--fast-transition'),
        widowActive = document.querySelector(".window-green.active")
    ;


    if ( document.querySelector(`.taskbar-item[task-id="${taskId}"]`) ) return;
    if ( hideMenu ) hideMenuItem(element, menuBox);
    let newWindow = spawnHtml( prepareWindow(windowData) ),
        usableWidth = window.innerWidth,
        usableHeight = getUsableHeight();
    // if ( newWindow.offsetWidth > usableWidth ) {
    //     windowData.windowBodyStyles += `display: flex; align-items: center;`;
    // }
    setWindowOnCenter(newWindow);
    if ( newWindow.offsetHeight > usableHeight ) {
        newWindow.style.height = newWindow.offsetHeight + 'px';
        let bordersWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-width')),
            bodyElement = newWindow.querySelector(".window-body"),
            bordersWrap = newWindow.querySelector(".window-borders"),
            usableHeight = getUsableHeight(),
            bodyMargin = parseFloat(window.getComputedStyle(bodyElement).margin),
            innerPadding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--inner-padding')),
            headerHeight = parseFloat(newWindow.querySelector(".window-top").offsetHeight);
        bordersWrap.style.height = usableHeight + 'px';
        bodyHeight = usableHeight - bordersWidth - bodyMargin - innerPadding;
        newWindow.style.top = '0px';
        newWindow.style.height = usableHeight + 'px';
        bodyElement.style.height   = usableHeight - (headerHeight + bordersWidth*2 + bodyMargin*2 + innerPadding*2) + 'px';
    }
    console.log(newWindow.offsetHeight);
    
    

    spawnTask(windowData);
    deactivate('.taskbar-item.active');
    activateTaskInTaskbar(taskId);

    if (widowActive) widowActive.classList.remove("active");
    newWindow.classList.add("active");
    
    forEachClick( {selector: ".window-green.unhanged",func: focusWindow} );
    // forEachFunc(".window-green.unhanged", windowResize);
    forEachClick( {selector: ".window-close.unhanged",func: closeWindow} );
    forEachClick( {selector: ".window-hide.unhanged",func: hideWindow} );
    forEachClick( {selector: ".window-maximize.unhanged",func: maximizeAction} );

    forEachClick( {selector: ".button",func: callNewFromExisted} );

    document.querySelector(".window-close.unhanged").classList.remove("unhanged");
    document.querySelector(".window-hide.unhanged").classList.remove("unhanged");
    document.querySelector(".window-maximize.unhanged").classList.remove("unhanged");
    forEachFunc(".window-head.unhanged", windowsDraging);
    document.querySelector(".window-head.unhanged").classList.remove("unhanged");
    newWindow.getElementsByClassName("window-borders")[0].style.width = newWindow.offsetWidth + 'px';
    newWindow.getElementsByClassName("window-borders")[0].style.height = newWindow.offsetHeight + 'px';
    
    transformAnimation({
        element: newWindow,
        transition: transition,
        transitionEnd: 'none',
        transformFrom: 'scale(0)',
        transformTo:  'scale(1)',
        classToRemove: 'unhanged',
        transformEnd: 'unset',
        // test: '12142'
    });

    if ( document.querySelectorAll(".taskbar-item").length < 2 ) {
        setTimeout(() => {
            setTasksMargin();
        }, 5);
    } else {
        setTasksMargin();
    }
    mooveTitle(newWindow);

    if (functionsToInit) functionsToInit.forEach(function(functionToInit) {
        if ( functionsToInitWindow[functionToInit] ) {
            functionsToInitWindow[functionToInit]();
        } else {
            throw new TypeError( message = `Function: ${functionToInit} don't found in array - functionsToInitWindow.` );
        }
    });
}
//

// spawning window
function prepareWindow ( windowObj = {} ) {
    let taskId = windowObj.id,
        taskName = windowObj.name,
        windowId = taskName.toLowerCase().replace( ' ', '-'),
        windowSizeClass = windowObj.windowSizeClass,
        windowBodyStyles = windowObj.windowBodyStyles,
        individualStyles = windowObj.individualStyles,
        stylesHTML = '<style></style>'
        windowData = windowObj.windowData,
        selector = ".window-green.unhanged",
        classHTML = "window-green unhanged"
    ;
    
    if (individualStyles) individualStyles.forEach(function(element) {
        stylesHTML = stylesHTML.replaceAll( '</', `#${windowId} ${element} </` );
    });
    let windowHTML = `
            <div id="${windowId}" class="${classHTML}" task-name="${taskName}" task-id="${taskId}" style="z-index: ${currentZindex++};">
                <div class="window-main">
                    <div class="window-top">
                        <div class="window-top-buttons">
                            <div class="window-hide unhanged">
                                <div class="hide-line"></div>
                            </div>
                            <div class="window-maximize unhanged">
                                <div class="maximize-1"></div>
                                <div class="maximize-2"></div>
                            </div>
                            <div class="window-close unhanged">
                                <div class="close-line1"></div>
                                <div class="close-line2"></div>
                            </div>
                        </div>
                        <div class="window-line"></div>
                    </div>
                    <div class="window-head unhanged"><div class="wh-header">[ ${taskName} ]</div></div>
                    <div class="window-body ${windowSizeClass}" style="${windowBodyStyles}">
                        ${stylesHTML}
                        ${windowData}
                    </div>
                </div>
                <div class="window-borders">
                    <div class="window-border-top">
                        <div class="window-border-top-right"></div>
                    </div>
                    <div class="window-border-bottom">
                        <div class="window-border-bottom-left"></div>
                    </div>
                    <div class="window-border-left"></div>
                    <div class="window-border-right"></div>
                    <div class="window-border-top-left"></div>
                    <div class="window-border-bottom-right"></div>
                </div>
            </div>
        `;
    return [windowHTML, selector];
}
//

// spawning task in taskbar
function spawnTask ( windowObj = {} ) {
    let taskId = windowObj.id,
        taskName = windowObj.name,
        elementHTML = `
            <div class="taskbar-item unhanged" style="left:-250px" task-name="${taskName}" task-id="${taskId}">
                <div class="tpi-title">[ ${taskName} ]</div>
            </div>
        `;
    if ( !document.querySelectorAll(".taskbar-item.unhanged")[0] ) {
        document.querySelectorAll(".taskbar-item-empty")[0].style.opacity = 0;
    }
        document.getElementById('taskbar-inner').insertAdjacentHTML('afterBegin', elementHTML);
    let newTask = document.querySelectorAll(".taskbar-item.unhanged")[0] ;
        forEachClick( {selector: ".taskbar-item.unhanged",func: clickTaskAtTaskBar} );
        newTask.classList.remove("unhanged");

    return newTask;
    
}
//

// functions to render page
// forEachClick( {selector: ".window-close",func: closeWindow} );

// hang window focus handler on window
// forEachClick( {selector: ".window-green",func: focusWindow} );
//

// // hang window focus handler on taskbar item
// forEachClick( {selector: ".taskbar-item",func: clickTaskAtTaskBar} );
// //

// spawnRadar(radarToDecard(spawnRadarVals(5)));

spawnMenuItems(jsonMenuItemsData);

checkWindowSize();








// setTimeout(() => {
//     document.querySelectorAll(".task-list-item")[3].click();
// }, 350);

// setTimeout(() => {
//     document.querySelectorAll(".task-list-item")[0].click();
// }, 820);
