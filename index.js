let proofText = '';

const updateProofText = () => {
    return proofText = document.querySelector('#practiceText').innerHTML;
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
        document.querySelector('#practiceText').style.animationName = 'blink' + this.level;
    },
    lvlRefresh: function() {
        this.level = 0;
        this.lvlChange();
    }
}

document.querySelector('#practiceText').addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);

    document.querySelector('#controls').classList.remove('invisible');

    updateProofText();
});


document.querySelector('#levelUp').addEventListener('click', () => levelObj.lvlUp());

document.querySelector('#levelDown').addEventListener('click', () => levelObj.lvlDown());

document.querySelector('#instructLink').addEventListener('click', function() {
    if (document.querySelector('#review').classList.contains('unselected')) {
        document.querySelector('#instructions'  ).classList.toggle('hidden');
    } else {
        document.querySelector('#instructions2').classList.toggle('hidden');
    }
});



const unselectButton = () => {
    document.querySelector('#memorize').classList.toggle('unselected');
    document.querySelector('#review').classList.toggle('unselected');
    document.querySelector('#instructions').classList.add('hidden');
    document.querySelector('#instructions2').classList.add('hidden');
}


const reviewMode = () => {
    unselectButton();
    document.querySelector('#advance').classList.toggle('invisible');
    updateProofText();
    levelObj.lvlRefresh();
    const text = document.querySelector('#practiceText');
    text.contentEditable = 'false';
    let textArray = proofText.split(' ');
    let blankArray = proofText.replace(/[a-z]/gi, '_').split(' ');

    let index = 0;
    
    text.innerHTML = blankArray.join(' ');

    const keyTest = () => {
        if (document.querySelector('#memorize').classList.contains('unselected')) {
            let result = event.key.toLowerCase();
            if (result === textArray[index][0].toLowerCase()) {
                blankArray[index] = textArray[index];
                text.innerHTML = blankArray.join(' ');
                index++;
            }
            if (textArray.slice(-1)[0] === blankArray.slice(-1)[0]) {
                text.innerHTML = text.innerHTML + '<h2 style="text-align: center">Congrats!</h2>'
                window.removeEventListener('keyup', keyTest);
            }
        }
    }

    window.addEventListener('keyup', keyTest);

}

const memorizeMode = () => {
    unselectButton();
    const text = document.querySelector('#practiceText');
    text.contentEditable = 'true';
    text.innerHTML = proofText;

    document.querySelector('#advance').classList.toggle('invisible');
    
}

document.querySelector('#review').addEventListener('click', function() {
    if (proofText && this.classList.contains('unselected')) {
        reviewMode();
    }
});

document.querySelector('#memorize').addEventListener('click', function() {
    if (this.classList.contains('unselected')) {
        memorizeMode();
    }
});


