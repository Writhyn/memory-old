const qS = document.querySelector.bind(document);

console.log('Version: ', 9.9);

const errorShake = (el) => {
    qS(el).classList.add('shake-horizontal');
    setTimeout(() => qS(el).classList.remove('shake-horizontal'), 300);
}

const proofText = {
    text: '',
    update: function() {
        return this.text = qS('#practiceText').innerHTML.replace(/&nbsp;/g, '').replace(/<div>|<br>/gi,'<br> ').replace(/<\/div>/gi,'');
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
        qS('.mobile').classList.remove('fixed');

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
        fail: '<h3 class="done">Hmm. Maybe use "Memorize Mode" for a bit and come back for another try! You got this!</h3>',
        close: '<h3 class="done">Sooooooo close!<br> <div id="tryAgain" class="myButtons">Give it another try!</div><br>I triple-dog dare you!</h3>',
        tips: "<h4 class='doneSub'>(Click 'Instructions' for some extra tips!)</h4>",
        practice: "<h4 class='doneSub'>(Don't forget to practice reciting out loud regularly!)</h4>",
        success: function() {return '<h3 class="done">' + revMode.congrats[Math.floor(Math.random() * revMode.congrats.length)] + '</h3>'}
    },
    reviewMode: function() {
        qS('#memorize').classList.add('unselected');
        qS('#review').classList.remove('unselected');
        qS('#instructions').classList.add('hidden');
        qS('#instructions2').classList.add('hidden');
        qS('#advance').classList.add('invisible');
        qS('.mobile').classList.remove('hidden');
        qS('#practiceText').contentEditable = 'false';
        
        proofText.update();
        memMode.lvlRefresh();

        let textArray = proofText.text.split(' ');
        let blankArray = textArray.map(el => el.replace(/[a-z0-9](?!([^<]+)?>)/gi, '_'));
        let index = 0;
        let failTest = 0;
        let failNum = 0;
        
        qS('#practiceText').innerHTML = blankArray.join(' ');

        const indexAdv = () => {
            index++;
            if (textArray[index] && textArray[index].match(/[a-z0-9](?!([^<]+)?>)/i) === null) {
                indexAdv();
            }
        }

        const keyTest = (result) => {
            if (result === textArray[index].match(/[a-z0-9]/i)[0].toLowerCase()) {
                blankArray[index] = textArray[index];
                indexAdv();
                failTest = 0;
            } else if (failTest === 2) {
                blankArray[index] = '<span class="brood">' + textArray[index] + '</span>';
                indexAdv();
                failTest = 0;
                failNum++;
            } else {
                errorShake('#shake');
                failTest++;
            }

            qS('#practiceText').innerHTML = blankArray.join(' ');
            
            if (blankArray.join(' ').indexOf('_') === -1) {
                window.onkeyup = null;
                qS('.mobile').classList.add('hidden');
                if (failNum) {
                    failNum >= textArray.length / 10 ?
                        qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.fail) :
                        qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.close);
                    qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.tips);
                } else {
                    qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.success());
                    qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.practice);
                }
            }
        }
        
        if (window.matchMedia("(hover: none), (max-width: 500px)").matches) {
            if (qS('#practiceText').clientHeight > 350) {
                console.log('this should be working');
                qS('.mobile').classList.add('fixed');
            }
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

const prepTextField = () => {
    qS('#sample').classList.add('hidden');
    qS('#shake').style.flexFlow = 'column nowrap';
}

qS('#practiceText').addEventListener("paste", e => {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    qS('#practiceText').innerText = text;
    prepTextField();
});

qS('#practiceText').addEventListener('input', () => {
    prepTextField();
});

qS('#machine').addEventListener('click', event => {
    switch (event.target.id) {
        case 'sample':
            prepTextField();
            qS('#practiceText').innerText = 'This you know, my beloved brethren, but everyone must be quick to hear, slow to speak, and slow to anger; for the anger of man does not achieve the righteousness of God.';
            break;
        case 'levelDown': memMode.lvlDown(); break;
        case 'levelUp': memMode.lvlUp(); break;
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