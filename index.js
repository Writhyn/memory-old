let textArray = [];

const submitText = () => {
    const text = document.querySelector('#practiceText');
    textArray = text.split(' ');
    
}

function removeText() {
    this.innerHTML = '';
    this.removeEventListener('click', removeText);
}

const levelObj = {
    level: 0,
    lvlUp: function() {
        if (this.level < 6) {
            this.level++;
            this.lvlChange();
        }
    },
    lvlDown: function() {
        if (this.level > 0) {
            this.level--;
            this.lvlChange();
        }
    },
    lvlChange: function() {
        document.querySelector('#level').innerHTML = 'Level ' + this.level;
        document.querySelector('h2').style.animationName = 'blink' + this.level;
    }
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

document.querySelector('#practiceText').addEventListener('click', removeText);

document.querySelector('#instructLink').addEventListener('click', function() {
    document.querySelector('#instructions').classList.toggle('hidden');
});

document.querySelector('#levelUp').addEventListener('click', () => levelObj.lvlUp());

document.querySelector('#levelDown').addEventListener('click', () => levelObj.lvlDown());