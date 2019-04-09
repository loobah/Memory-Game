/*
 * Create a list that holds all of your cards
 */
const cards = ['fa-diamond', 'fa-diamond',
              'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor',
              'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube',
              'fa-leaf', 'fa-leaf',
              'fa-bicycle', 'fa-bicycle',
              'fa-bomb', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// generate cards programatically!
/* Mike's webminar really helped me to get my head around this project */
// html list template
function generateCard(card) {
  return `<li class="card"><i class="fa ${card}"></i></li>`;
}
// shuffled contents generated programatically
function initGame() {
  var deck = document.querySelector('.deck');
  var cardHTML = shuffle(cards).map(function(card) {
    return generateCard(card);
  });

  deck.innerHTML = cardHTML.join('');
}

initGame();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/* The other big influencer was Matthew Cranford, I found the link to his
   walkthough at Udacity Student Hub */
let toggledCards = [];
const deck = document.querySelector('.deck');

deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)
  ) {
    // starts clock at 1st click
    if (startGame === 0) {
        timer();
        startGame++;
    }

    toggleCard(clickTarget);
    addToggleCard(clickTarget);

    // when 2 cards are clicked
    if (toggledCards.length === 2) {
        checkForMatch(clickTarget);
        // moves counter
        addMove();
        // stars
        checkScore();
        // check for Game Over
        /* I only achieved the full functionality of this
        game when I thought about using setTimeout function here!
        Before that, the alert was popping up before flipping the last card! */
        setTimeout(() => {
          checkForGameOver();
        }, 700);
    }
  }
});

function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
  console.log(toggledCards);
}

function checkForMatch() {
  if (
    toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className
  ) {
      toggledCards[0].classList.toggle('match');
      toggledCards[1].classList.toggle('match');
      toggledCards = [];
  } else {
      setTimeout(() => {
        toggleCard(toggledCards[0]);
        toggleCard(toggledCards[1]);
        toggledCards = [];
      }, 1000);
  }
}

// moves counter
let moves = 0;

function addMove() {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

// starts
function checkScore() {
  if (moves === 13 || moves === 22) {
    fadeStar();
  }
}

// changes classes of stars progressivesly instead of hidding!
/* This was a very successful tweak from Matthew's code!
   At this stage I was very happy to notice my mind was
   starting to get atound the JS programming logic */
function fadeStar() {
  const starList = document.querySelectorAll('.stars li i');
  for (star of starList) {
    if (star.className !== 'fa fa-star-o') {
      star.classList.remove('fa-star');
      star.classList.add('fa-star-o');
      break;
    }
  }
}

// clock
/* timer inspired by
https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
The chunk looked really short and straight fwd! */
let time = document.querySelector('.clock');
let startGame = 0;
let gameInterval;

function timer() {
    let minutes = 0;
    let seconds = 0;
    gameInterval = setInterval(function () {
        seconds = parseInt(seconds, 10) + 1;
        minutes = parseInt(minutes, 10);
        if (seconds >= 60) {
            minutes += 1;
            seconds = 0;
        }

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        time.innerHTML = minutes + ":" + seconds;
        /* I can't understarn why console keeps sending
        an uncaught reference error at this line...
        is that undefined on purpose so it logs the time to the HTML? */
        lastTime.textContent = time.textContent;
    }, 1000);
}

/* restarts reloading the page... given my JS limitations/knowledge
   I though this could be the simplest wat to reset everything!
   I hope it's ok to use the alert as a modal?? */
document.querySelector('.restart').addEventListener('click', modal);

// restart section
function resetGame() {
  document.location.reload()
}

// modal restart (alert box)
function modal() {
  swal({
  title: "Restart game?",
  text: "You are about to start from scratch.",
  icon: "warning",
  buttons: true,
  dangerMode: true,
})
.then((willRestart) => {
  if (willRestart) {
    resetGame();
  }
});
}

// checks if all 16 cards have matched
/* My own idea!! I'm so stoked to realize things are making more sense now!
   The beginning of this project was really rough to me, I have to confess! */
function checkForGameOver() {
  let sameClass = document.querySelectorAll('.match').length;
  if (sameClass === 16) {
    congrats();
  }
}

// modal congrats (alert box)
function congrats() {
  // took a while to figure it out... unbelieveable... I'm so stoked!!!
  // solutions can be way simpler than we imagine!!!
  // guess I'm gettin the hang of the console testing!
  const starCounter = document.querySelectorAll('.fa-star').length;
  const finalTime = document.querySelector('.clock').textContent;

  swal({
  title: "You matched all the cards!",
  text: "With " + moves + " moves.\n" + starCounter + " stars.\n" + "At time " + finalTime + ".\n\nPlay again?",
  icon: "success",
  buttons: true,
  dangerMode: false,
})
  .then((willRestart) => {
  if (willRestart) {
    resetGame();
  }
});
}
