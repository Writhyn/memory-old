let textArray = [];
let blankArray = [];

const submitText = () => {
    const text = document.querySelector('#practiceText').innerHTML;
    textArray = text.split(' ');
    blankArray = text.replace(/[a-z]/gi, '_').split(' ');
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

document.querySelector('#instructLink').addEventListener('click', function() {
    document.querySelector('#instructions').classList.toggle('hidden');
});

document.querySelector('#levelUp').addEventListener('click', () => levelObj.lvlUp());

document.querySelector('#levelDown').addEventListener('click', () => levelObj.lvlDown());





const reviewMode = () => {
    let index = 0;
    document.querySelector('#practiceText').innerHTML = blankArray.join(' ');
    window.addEventListener('keyup', (event) => {
        const text = document.querySelector('#practiceText');
        let result = event.key.toLowerCase();
        if (result === textArray[index][0].toLowerCase()) {
            blankArray[index] = textArray[index];
            text.innerHTML = blankArray.join(' ');
            index++;
        }
    });
}

document.querySelector('#reviewMode').addEventListener('click', function() {
    if (document.querySelector('#practiceText').innerHTML) {
        document.querySelector('#advance').classList.toggle('invisible');
        reviewMode();
    }
});


