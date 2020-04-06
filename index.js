let textArray = [];

const submitText = () => {
    const text = document.querySelector('#practiceText');
    text.style.textAlign = 'justify';
    textArray = text.split(' ');
    
}

const showInstructions = () => {
    document.querySelector('#instructions').classList.toggle('hidden');
}

document.querySelector('#practiceText').addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);

    submitText();
});

let levelObj = {
    level: 0
}

const levelChange = () => {
    document.querySelector('#level').innerHTML = 'Level ' + levelObj.level;
    document.querySelector('h2').style.animationName = 'blink' + levelObj.level;
}

const levelUp = () => {
    if (levelObj.level < 6) {
        levelObj.level++;
        levelChange();
    }
}

const levelDown = () => {
    if (levelObj.level > 0) {
        levelObj.level--;
        levelChange();
    }
}


document.querySelector('#instructLink').addEventListener('click', showInstructions);

document.querySelector('#levelUp').addEventListener('click', levelUp);

document.querySelector('#levelDown').addEventListener('click', levelDown);