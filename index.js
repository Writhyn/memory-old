'use strict';
const qS = document.querySelector.bind(document);

const errorShake = el => {
    qS(el).classList.add('shake-horizontal');
    setTimeout(() => qS(el).classList.remove('shake-horizontal'), 300);
}

const hide = (...els) => els.map(el => qS(el).classList.add('hidden'));
const unHide = (...els) => els.map(el => qS(el).classList.remove('hidden'));

const proofText = {
    text: '',
    update() {
        return this.text = qS('#practiceText').innerHTML
            .replace(/<br>|<div>/g, '#')
            .replace(/&nbsp;|(<([^>]+)>)/g, '')
            .replace(/#/g, '<br> ')
            .replace(/  +/g, ' ');
    }
}

const memMode = {
    level: 0,
    sampleText: "This you know, my beloved brethren, but everyone must be quick to hear, slow to speak, and slow to anger; for the anger of man does not achieve the righteousness of God.",
    lvlChange() {
        qS('#level').innerHTML = 'Level ' + this.level;
        qS('#practiceText').style.webkitAnimationName = 'blink' + this.level;
    },
    lvlUp() {
        this.level < 6 && this.level++;
        this.lvlChange();
    },
    lvlDown() {
        this.level > 0 && this.level--;
        this.lvlChange();
    },
    lvlRefresh() {
        this.level = 0;
        this.lvlChange();
    },
    memorizeMode() {
        hide('#revButton', '#instructions', '#instructions2', '.mobile');
        unHide('#advance');
        qS('#float').classList.remove('float-review');
        qS('.mobile').classList.remove('fixed');
        qS('#practiceText').contentEditable = 'true';
        qS('#practiceText').innerHTML = proofText.text;
        window.onkeyup = null;
    }
}

const revMode = {
    congrats: [
        "Your future is looking so bright that I need sunglasses.",
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
        fail: '<h3 class="done">Hmm. Maybe use "Memorize Mode" for a bit and come back for another try! You got this!</h3><h4 class="doneSub">(Click "Instructions" for some extra tips!)</h4>',
        close: '<h3 class="done">Sooooooo close!<br> <div id="tryAgain" class="myButtons">Give it another try!</div><br>I triple-dog dare you!</h3><h4 class="doneSub">(Click "Instructions" for some extra tips!)</h4>',
        success() {return `<h3 class="done">${revMode.congrats[Math.floor(Math.random() * revMode.congrats.length)]}</h3><h4 class='doneSub'>(Don't forget to practice reciting out loud regularly!)</h4>`}
    },
    easyMode: true,
    reviewMode() {
        hide('#instructions', '#instructions2', '#advance');
        unHide('#revButton', '.mobile')
        qS('#float').classList.add('float-review');
        qS('#practiceText').contentEditable = 'false';
        proofText.update();
        memMode.lvlRefresh();
        
        let textArray = proofText.text
            .replace(/<br>/g, '#')
            .split(this.easyMode ? ' ' : '')
            .map(el => el.replace('#', '<br> '));
        let blankArray = textArray.map(el => el.replace(/[a-z0-9](?!([^<]+)?>)/gi, '_'));
        let index = 0;
        let failTest = 0;
        let failNum = 0;

        qS('#practiceText').innerHTML = blankArray.join(this.easyMode ? ' ' : '');

        const indexAdv = () => {
            index++;

            if (textArray[index] && !textArray[index].match(/[a-z0-9](?!([^<]+)?>)/i)) {

                indexAdv();
            }
        }

        const keyTest = (result) => {

            if (result === textArray[index].match(/[a-z0-9]/i)[0].toLowerCase()) {
                blankArray[index] = textArray[index];
                indexAdv();
                failTest = 0;
            } else if (result === ' ') {
                return;
            } else if (failTest === 2) {
                blankArray[index] = '<span class="brood">' + textArray[index] + '</span>';
                indexAdv();
                failTest = 0;
                failNum++;
            } else {
                errorShake('#shake');
                failTest++;
            }

            qS('#practiceText').innerHTML = blankArray.join(this.easyMode ? ' ' : '');

            if (blankArray.join(' ').indexOf('_') === -1) {
                window.onkeyup = null;
                hide('.mobile');
                if (failNum) {
                    return failNum >= textArray.length / 10
                        ? qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.fail)
                        : qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.close);
                }
                qS('#practiceText').insertAdjacentHTML('beforeend', this.fin.success());
            }
        }
        
        if (window.matchMedia("(hover: none), (max-width: 500px)").matches) {
            qS('#practiceText').clientHeight > 300
                ? qS('.mobile').classList.add('fixed')
                : qS('.mobile').classList.remove('fixed');
            qS('.mobile').oninput = (event) => {
                const result = event.target.value.toLowerCase();
                keyTest(result);
                qS('.mobile').value = '';
            };
        } else {
            window.onkeyup = (event) => {
                const result = event.key.toLowerCase();
                keyTest(result);
            };
        }
    }, 
}

const prepTextField = () => {
    hide('#sample');
    qS('#shake').style.flexFlow = 'column nowrap';
}

qS('#practiceText').addEventListener("paste", e => {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    qS('#practiceText').innerText = text;
    prepTextField();
});

qS('#practiceText').addEventListener('input', () => {
    qS('#sample').classList.contains('hidden') || prepTextField();
});

qS("#machine").addEventListener("mousedown", (event) => {
    switch (event.target.id) {
        case "levelDown":
            return memMode.lvlDown();
        case "levelUp":
            return memMode.lvlUp();
        case "memorize":
            return memMode.memorizeMode();
        case "review":
            return qS("#practiceText").innerHTML ? revMode.reviewMode() : errorShake("#shake");
        case "underLink":
            return qS("#float").classList.contains("float-review")
                ? qS("#instructions2").classList.toggle("hidden")
                : qS("#instructions").classList.toggle("hidden");
        case "toggle":
            revMode.easyMode = !revMode.easyMode;
            // falls through
        case "tryAgain":
            memMode.memorizeMode();
            revMode.reviewMode();
            break;
        case "sample":
            prepTextField();
            qS("#practiceText").innerText = memMode.sampleText;
    }
  });

  console.log('%cNevermore', 'font-size: smaller; font-weight: bold');
