let textArray = [];

const submitText = () => {
    const text = document.querySelector('#practiceText');
    textArray = text.split(' ');
    
}

const removeText = () => {
    const text = document.querySelector('#practiceText');
    if (text.innerHTML === 'Paste text here, change difficulty level below') {
        text.innerHTML = '';
    }
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
    level: 0,
    levelUp: function() {
        this.level++;
    },
    levelDown: function() {
        this.level--;
    }
}

const levelChange = () => {
    document.querySelector('#level').innerHTML = 'Level ' + levelObj.level;
    document.querySelector('h2').style.animationName = 'blink' + levelObj.level;
}

const levelUp = () => {
    if (levelObj.level < 6) {
        levelObj.levelUp();
        levelChange();
    }
}

const levelDown = () => {
    if (levelObj.level > 0) {
        levelObj.levelDown();
        levelChange();
    }
}

document.querySelector('#practiceText').addEventListener('click', removeText);

document.querySelector('#instructLink').addEventListener('click', showInstructions);

document.querySelector('#levelUp').addEventListener('click', levelUp);

document.querySelector('#levelDown').addEventListener('click', levelDown);