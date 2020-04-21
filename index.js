const qS = document.querySelector.bind(document);

const errorShake = (el) => {
    qS(el).classList.add('shake-horizontal');
    setTimeout(() => qS(el).classList.remove('shake-horizontal'), 300);
}

const proofText = {
    text: '',
    update: function() {
        return this.text = qS('#practiceText').innerHTML;
    }
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
        qS('#level').innerHTML = 'Level ' + this.level;
        qS('#practiceText').style.webkitAnimationName = 'blink' + this.level;
    },
    lvlRefresh: function() {
        this.level = 0;
        this.lvlChange();
    },
    memorizeMode: function() {
        qS('#memorize').classList.remove('unselected');
        qS('#review').classList.add('unselected');
        qS('#instructions').classList.add('hidden');
        qS('#instructions2').classList.add('hidden');
        qS('#advance').classList.remove('invisible');
        qS('.mobile').classList.add('hidden');

        qS('#doneMessage').classList.add('hidden');

        qS('#practiceText').contentEditable = 'true';
        qS('#practiceText').innerHTML = proofText.text;
        window.onkeyup = null;
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
    ],
    fin: {
        fail: 'Hmm. Maybe use "Memorize Mode" for a bit and come back for another try! You got this!',
        close: 'Sooooooo close!<div id="tryAgain" class="myButtons">Give it another try!</div>I triple-dog dare you!',
        tips: "(Click 'Instructions' for some extra tips!)",
        practice: "(Don't forget to practice reciting out loud regularly!)",
        success: function() {return revMode.congrats[Math.floor(Math.random() * revMode.congrats.length)]}
    },
    reviewMode: function() {
        qS('#memorize').classList.add('unselected');
        qS('#review').classList.remove('unselected');
        qS('#instructions').classList.add('hidden');
        qS('#instructions2').classList.add('hidden');
        qS('#advance').classList.add('invisible');
        qS('.mobile').classList.remove('hidden');
        
        proofText.update();
        memMode.lvlRefresh();

        qS('#practiceText').contentEditable = 'false';
        let textArray = proofText.text.split(' ');
        let blankArray = proofText.text.replace(/[a-z0-9]/gi, '_').split(' ');

        let index = 0;
        let failTest = 0;
        let failNum = 0;
        
        
        qS('#practiceText').innerHTML = blankArray.join(' ');


        const keyTest = (result) => {

            if (result === textArray[index].match(/[a-z0-9]/i)[0].toLowerCase()) {
                blankArray[index] = textArray[index];
                index++;
                failTest = 0;
            } else if (failTest === 2) {
                blankArray[index] = '<span style="color: var(--darkest);">' + textArray[index] + '</span>';
                index++;
                failTest = 0;
                failNum++;
            } else {
                errorShake('#shake');
                failTest++;
            }

            qS('#practiceText').innerHTML = blankArray.join(' ');
            
            if (blankArray.slice(-1)[0][0] !== '_') {
                qS('.mobile').classList.add('hidden');
                qS('#doneMessage').classList.remove('hidden');
                if (failNum) {
                    failNum >= textArray.length / 10 ? qS('#done').innerHTML = this.fin.fail : qS('#done').innerHTML = this.fin.close;
                    qS('#doneSub').innerHTML = this.fin.tips;
                } else {
                    qS('#done').innerHTML = this.fin.success();
                    qS('#doneSub').innerHTML = this.fin.practice;
                }
            }
        }
        
        if (window.matchMedia("(hover: none), (max-width: 500px)").matches) {
            qS('.mobile').oninput = (event) => {
                result = event.target.value.toLowerCase();
                keyTest(result);
                qS('.mobile').value = '';
            };
        } else {
            window.onkeyup = (event) => {
                result = event.key.toLowerCase();
                keyTest(result);
            };
        }
    },
}

qS('#practiceText').addEventListener("paste", e => {
    // cancel paste
    e.preventDefault();
    // get text representation of clipboard
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    // insert text manually
    qS('#practiceText').innerHTML = text;
});

qS('#practiceText').addEventListener('input', () => {
    qS('#sample').classList.add('hidden');
    qS('#shake').style.flexFlow = 'column nowrap';
});

qS('#machine').addEventListener('click', event => {
    switch (event.target.id) {
        case 'sample':
            qS('#sample').classList.add('hidden');
            qS('#shake').style.flexFlow = 'column nowrap';
            qS('#practiceText').innerText = 'This you know, my beloved brethren, but everyone must be quick to hear, slow to speak, and slow to anger; for the anger of man does not achieve the righteousness of God.';
        case 'levelDown':
            memMode.lvlDown();
            break;
        case 'levelUp':
            memMode.lvlUp();
            break;
        case 'memorize':
            if (qS('#memorize').classList.contains('unselected')) {
                memMode.memorizeMode();
            }
            break;
        case 'review':
            qS('#practiceText').innerHTML && qS('#review').classList.contains('unselected') ?
                revMode.reviewMode() :
                errorShake('#shake');
            break;
        case 'tryAgain':
            memMode.memorizeMode();
            revMode.reviewMode();
            break;
        case 'underLink':
            qS('#review').classList.contains('unselected') ? 
                qS('#instructions').classList.toggle('hidden') :
                qS('#instructions2').classList.toggle('hidden');
    }
})


