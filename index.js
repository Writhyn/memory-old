const practiceText = document.querySelector('#practiceText');


const proofText = {
    text: '', // this establishes what will become the master text used when making checks or switching between modes
    update: function() {
        return this.text = practiceText.innerHTML; // this makes prooftext current with whatever is in the practice text
    }
}

const revMode = {
    congrats: [
        "Keep being awesome, and I'll keep saying congratulations.",
        "Your future is looking so bright that I need sunglasses.",
        "Your future is no longer uncertain. You have achieved your goals.",
        "I am successful just by knowing you. I'll congratulate myself, too!",
        "Please stop giving me so many reasons to be impressed. I'm getting overwhelmed.",
        "There are only so many ways for me to say congratulations, and I'll use them all!",
        "I need to congratulate both of us because I knew you'd be successful!",
        "Sometimes I make a big deal about nothing, but this time I'm not exaggerating. Way to go!",
        "I'm thinking of a word for you that starts with 'C' and ends in 'ongratulations.'",
        "You have performed extremely adequately!",
        "I have so much pride in my heart right now. Is that wrong?",
        "I love your accomplishments almost as much as I love the person who did them.",
        "I can't think of any advice I need to give you. You have proven your competence.",
    ]
}

const memMode = {
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
        practiceText.style.webkitAnimationName = 'blink' + this.level;
    },
    lvlRefresh: function() {
        this.level = 0;
        this.lvlChange();
    }
}

const modeActivate = {
    mode: 'memorize',

    unselectButton: function() {
        document.querySelector('#memorize').classList.toggle('unselected');
        document.querySelector('#review').classList.toggle('unselected');
        document.querySelector('#instructions').classList.add('hidden');
        document.querySelector('#instructions2').classList.add('hidden');
        document.querySelector('#advance').classList.toggle('invisible');
        document.querySelector('.mobile').classList.toggle('hidden');
    },

    reviewMode: function() {
        this.mode = 'review';
        this.unselectButton();
        proofText.update();
        memMode.lvlRefresh();

        practiceText.contentEditable = 'false';
        let textArray = proofText.text.split(' ');
        let blankArray = proofText.text.replace(/[a-z]/gi, '_').split(' ');

        let index = 0;
        let failTest = 0;
        let tryAgain = 0;
        
        
        practiceText.innerHTML = blankArray.join(' ');


        const keyTest = (result) => {

            const nextWord = () => {
                practiceText.innerHTML = blankArray.join(' '); // this displays the current blankarray in the practice text
                index++; // this advances the word being checked to the next blank
                failTest = 0; // this resets the number of mistyped key attempts
            }

            if (result === textArray[index].match(/[a-z]/i)[0].toLowerCase()) { //this checks keycode against the first letter of the el in textarray that corresponds with the current blank
                blankArray[index] = textArray[index]; // this changes the current blank to the corresponding el from textarray
                nextWord();
            } else if (failTest === 2) {
                blankArray[index] = '<span style="color: var(--darkest);">' + textArray[index] + '</span>';
                nextWord();
                tryAgain++;
            } else {
                errorShake();
                failTest++;
            }
            
            if (blankArray.slice(-1)[0][0] !== '_') {
                const done = document.querySelector('#done');
                const doneSub = document.querySelector('#doneSub');
                done.classList.remove('hidden');
                doneSub.classList.remove('hidden');
                if (tryAgain >= textArray.length / 10) {
                    done.innerHTML = 'Hmm. Maybe use "Memorize Mode" for a bit and come back for another try! You got this!';
                    doneSub.innerHTML = "(Click 'Instructions' for some extra tips!)";
                } else if (tryAgain) {
                    done.innerHTML = 'Sooooooo close! <u>Give it another try</u>, I triple-dog dare you!';
                    done.style.cursor = 'pointer';
                    done.addEventListener('click', function() {
                        done.style.cursor = 'auto';
                        modeActivate.memorizeMode();
                        modeActivate.reviewMode();
                    })
                    doneSub.innerHTML = "(Click 'Instructions' for some extra tips!)";
                } else {
                    done.innerHTML = revMode.congrats[Math.floor(Math.random() * 13)];
                    doneSub.innerHTML = "(Don't forget to practice regularly!)";
                }
                window.removeEventListener('keyup', keyTest);
            }

        }
        
        if (window.matchMedia("(hover: none), (max-width: 500px)").matches) {
            document.querySelector('.mobile').onclick = function() {
                result = event.target.value.toLowerCase();
                keyTest(result);
                this.value = '';
            };
        } else {
            window.onkeyup = function() {
                result = event.key.toLowerCase();
                keyTest(result);
            };
        }
        
    },
    memorizeMode: function() {
        this.mode = 'memorize';
        document.querySelector('#done').classList.add('hidden');
        document.querySelector('#doneSub').classList.add('hidden');
        this.unselectButton();

        practiceText.contentEditable = 'true';
        practiceText.innerHTML = proofText.text;
        window.onkeyup = null;
    }
}

practiceText.addEventListener("paste", function(e) {
    // cancel paste
    e.preventDefault();

    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');

    // insert text manually
    document.execCommand("insertHTML", false, text);

    document.querySelector('#controls').classList.remove('invisible');

});

practiceText.addEventListener('input', function() {
    document.querySelector('#sample').classList.add('hidden');
    document.querySelector('#shake').style.flexFlow = 'column nowrap';
});

const errorShake = () => {
    document.querySelector('#shake').classList.add('shake-horizontal');
    setTimeout(function() {
        document.querySelector('#shake').classList.remove('shake-horizontal');
    }, 500);
}

document.querySelector('#machine').addEventListener('click', function(event) {
    switch (event.target.id) {
        case 'sample':
            document.querySelector('#sample').classList.add('hidden');
            document.querySelector('#shake').style.flexFlow = 'column nowrap';
            practiceText.innerText = 'This you know, my beloved brethren, but everyone must be quick to hear, slow to speak, and slow to anger; for the anger of man does not achieve the righteousness of God.';
        case 'levelDown':
            memMode.lvlDown();
            break;
        case 'levelUp':
            memMode.lvlUp();
            break;
        case 'memorize':
            if (modeActivate.mode === 'review') {
                modeActivate.memorizeMode();
            }
            break;
        case 'review':
            practiceText.innerHTML && modeActivate.mode === 'memorize' ?
                modeActivate.reviewMode() :
                errorShake();
            break;
        case 'underLink':
            modeActivate.mode === 'memorize' ? 
                document.querySelector('#instructions').classList.toggle('hidden') :
                document.querySelector('#instructions2').classList.toggle('hidden');
    }
})


