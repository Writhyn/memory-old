const proofText = {
    text: '', // this establishes what will become the master text used when making checks or switching between modes
    update: function() {
        return this.text = document.querySelector('#practiceText').innerHTML; // this makes prooftext current with whatever is in the practice text
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

    proofText.update();
});

document.querySelector('#levelUp').addEventListener('click', () => levelObj.lvlUp());

document.querySelector('#levelDown').addEventListener('click', () => levelObj.lvlDown());

document.querySelector('#practiceText').addEventListener('input', () => proofText.update());

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

    const congrats = [
        "Keep being awesome, and I'll keep saying congratulations.",
        "Your future is looking so bright that I need sunglasses.",
        "Your future is no longer uncertain. You have achieved your goals.",
        "I am successful just by knowing you. I'll congratulate myself.",
        "Please stop giving me so many reasons to be impressed. I'm getting overwhelmed.",
        "There are only so many ways for me to say congratulations, and I've used up most of them.",
        "I need to congratulate both of us because I knew you'd be successful!",
        "Sometimes I make a big deal about nothing, but this time I'm not exaggerating. Way to go!",
        "I'm thinking of a word for you that stats with 'C' and ends in 'ongratulations.'",
        "You have performed extremely adequately!",
        "I have so much pride in my heart right now. It might even be a sin.",
        "I love your accomplishments almost as much as I love the person who did them.",
        "I can't think of any advice I need to give you. You have proven your competence.",
    ];

    unselectButton();
    document.querySelector('#advance').classList.toggle('invisible');
    proofText.update();
    levelObj.lvlRefresh();
    const text = document.querySelector('#practiceText');
    text.contentEditable = 'false';
    let textArray = proofText.text.split(' ');
    let blankArray = proofText.text.replace(/[a-z]/gi, '_').split(' ');

    let index = 0;
    let failTest = 0;
    let tryAgain = 0;
    
    text.innerHTML = blankArray.join(' ');

    const nextWord = () => {
        text.innerHTML = blankArray.join(' '); // this displays the current blankarray in the practice text
        index++; // this advances the word being checked to the next blank
        failTest = 0; // this resets the number of mistyped key attempts
    }

    const keyTest = () => {
        if (document.querySelector('#memorize').classList.contains('unselected')) {
            let result = event.key.toLowerCase(); // This turns the keycode to lowercase for checks
            let num = textArray[index].search(/[a-z]/i); //This prevents elements starting with punctuation (like quotes) from breaking things
            
            if (result === textArray[index][num].toLowerCase()) { //this checks keycode against the first letter of the el in textarray that corresponds with the current blank
                blankArray[index] = textArray[index]; // this changes the current blank to the corresponding el from textarray
                nextWord();
            } else if (failTest === 2) {
                blankArray[index] = '<span style="color: var(--darkest);">' + textArray[index] + '</span>';
                nextWord();
                tryAgain++;
            } else {
                failTest++;
            }
            if (blankArray.slice(-1)[0][0] !== '_') {
                if (tryAgain >= textArray.length / 10) {
                    text.innerHTML = text.innerHTML + '<h3 style="text-align: center; color: var(--darkest);">' + 'Hmm. Maybe use "Memorize Mode" for a bit and come back for another try! You got this!' + '</h3><h4 style="text-align: center; color: var(--dark);">' + "(Click 'Instructions' for some extra tips!)" + '</h4>';
                } else if (tryAgain) {
                    text.innerHTML = text.innerHTML + '<h3 style="text-align: center; color: var(--darkest);">' + 'Sooooooo close! Give it another try, I triple-dog dare you!' + '</h3><h4 style="text-align: center; color: var(--dark);">' + "(Click 'Instructions' for some extra tips!)" + '</h4>';
                } else {
                    text.innerHTML = text.innerHTML + '<h3 style="text-align: center; color: var(--darkest);">' + congrats[Math.floor(Math.random() * 13)] + '</h3><h4 style="text-align: center; color: var(--dark);">' + "(Don't forget to practice regularly!)" + '</h4>';
                }
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
    text.innerHTML = proofText.text;

    document.querySelector('#advance').classList.toggle('invisible');
    
}

document.querySelector('#review').addEventListener('click', function() {
    if (proofText.text && this.classList.contains('unselected')) {
        reviewMode();
    }
});

document.querySelector('#memorize').addEventListener('click', function() {
    if (this.classList.contains('unselected')) {
        memorizeMode();
    }
});


