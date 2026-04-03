// imports
import { IPrepare } from "./modules/prepare.model";
import { ICard } from "./modules/car.model";

// variables
const prepare: IPrepare = {};
prepare.cards = []; //empty array
prepare.progress = 0;
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.flipAudio = new Audio('./assets/audio/flip.mp3');
prepare.fullTrack = new Audio('./assets/audio/fulltrack.mp3');
prepare.gameOverAudio = new Audio('./assets/audio/game-over.mp3');
prepare.goodAudio = new Audio('./assets/audio/good.mp3');
prepare.fullTrack.loop = true;

const numberOfCards = 20;
const tempNumbers = [];
let cardsHtmlContent = ''; // to write what will be written in the html

// functions
const getRandomInt = (min, max) => {
    let result: number;
    let exists = true; //to test the tempNumbers if the number is repeated or not
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(no => no === result.toString())) {
            exists = false;
            tempNumbers.push(result.toString());
        }
    }
    return result;
}

const flip = (card: ICard, index: number) => {
    prepare.flipAudio.play(); // the sound of the flip audio
    if (card) {
        // card.flip =card.flip === '' ? 'flip' : '';
        if (card.flip === '') {
            card.flip = 'flip';
        } else {
            card.flip = '';
        }
        document.getElementById(`card-flip-${index}`).classList.value = card.flip;
    }
}

const stopAudio = (audio: HTMLAudioElement) => {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
}

const changeProgress = () => {
    const progress = prepare.cards.filter(card => !card.clickable).length / numberOfCards * 100; // in percentage
    const progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${progress}%`;

}

const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numberOfCards) {
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.failAudio);
        stopAudio(prepare.goodAudio);
        prepare.gameOverAudio.play();
    }
}

const selectCard = (card: ICard, index: number) => {
    // to identify the two cards
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }

    // test the cards if they exist or not, then if if they have the same src
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
        } else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
            }, 1000);
        }
    }
}

// when i click on the card
const toggleFlip = (index) => {
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
}

// Game Logic
// note that numberOfCards = 20
//  we divide by 2 bcz we need half the card and we will push the same cards twice but with different id, so you will get 20 cards in total
for (let index = 0; index < numberOfCards / 2; index++) {
    // push card 1
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
    // push card 2
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
}

prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);

prepare.cards.forEach((item, index) => {
    cardsHtmlContent += 
    `<span class="col-4 col-md-3 col-lg-2">
        <!-- Card flip -->
            <div onclick="toggleFlip(${index})" class="card-flip">
            <div id="card-flip-${index}">
                <div class="front">
                    <!-- Front Content -->
                        <div class="card">
                        <img class="card-image" src="./assets/back.jpg" alt="Loading...">
                        <span class="card-content" >${index + 1}</span>
                        </div>
                </div>
                <div class="back">
                    <!-- Back of the card -->
                        <div class="card">
                        <img src="./assets/images/${item.index}.jpg" alt="Image [100%x180]" data-holder-rendered="" style= "height: 120px; width:100%; display:block;">
                        </div>
                </div>
            </div>
            </div>
     </span> `;
});

document.getElementById('cards').innerHTML = cardsHtmlContent;

(window as any).toggleFlip = toggleFlip;
