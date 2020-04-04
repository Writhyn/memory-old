function submitText() {
    const text = document.querySelector('#inputText').value;
    if (text.length > 0) {
        document.querySelector('#practiceText').innerHTML = text;
        document.querySelector("#startDiv").style.display = 'none';
    }
}

let level = 0;

function levelUp() {
    if (level < 5) {
        level++;
        document.querySelector('#level').innerHTML = 'Level ' + level;
    }
}

function levelDown() {
    level--;
    document.querySelector('#level').innerHTML = 'Level ' + level;
}

function blink1() {
    document.querySelector('h2').style.animationName = 'blink1';
}

function blink2() {
    document.querySelector('h2').style.animationName = 'blink2';
}

function blink3() {
    document.querySelector('h2').style.animationName = 'blink3';
}

function blink4() {
    document.querySelector('h2').style.animationName = 'blink4';
}

function blink5() {
    document.querySelector('h2').style.animationName = 'blink5';
}

function blinkStop() {
    document.querySelector('h2').style.animationName = null;
    document.querySelector('h2').style.opacity = ('100');
}

function boss() {
    document.querySelector('h2').style.animationName = null;
    document.querySelector('h2').style.opacity = ('0');
}
