/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */




//testing clicking functionality
const cards = document.getElementsByClassName('card');

for (var card of cards) {
    let that = card
    card.addEventListener('click', function(el) {
        console.log(el)
        that.classList.contains('show') ? 
            that.classList.remove('show') 
            : that.classList.add('show');
    }); 
}



// MY ATTEMPT to build this in a MOV format

// The model holds all the games data.

const Model = {

    //Builds out the card deck elements into an easy to access array
    buildDeck: function() {
        let startDeck = [];

        function createCard(card) {
            const baseCard = document.createElement('li');
            baseCard.className = 'card';
            baseCard.dataset.item = card;
            baseCard.subEl = document.createElement('i');
            baseCard.subEl.className = 'fa fa-' + card;
            baseCard.appendChild(baseCard.subEl);
            return baseCard
        }

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

        for (var card of this.cards) {
            startDeck.push(createCard(card));
            startDeck.push(createCard(card));
        }

        this.deck = shuffle(startDeck);
    },

    //This runs on game start.
    init: function() {
        if (localStorage.getItem('ecmMemGame')) {
            const game = localStorage.getItem('ecmMemGame');
            this.moves = game.moves;
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
        } else {
            this.cards = [
                'diamond',
                'paper-plane-o',
                'anchor',
                'bolt',
                'cube',
                'leaf',
                'bicycle',
                'bomb'
            ];

            this.buildDeck();
        }
    }
}

const View = {
    init: function() {
        this.theDeck = document.getElementsByClassName('deck')[0];
        this.theDeck.innerHTML = '';
        for (var card of Octo.getDeck()){
            card.addEventListener('click', function(el) {
                el.target.classList.contains('show') ? 
                    el.target.classList.remove('show') 
                    : el.target.classList.add('show');
            }); 
            this.theDeck.appendChild(card);
        }



    }
}

const Octo = {

    getDeck: function() {
        return Model.deck;
    },

    setDeck: function(deck) {
        Model.deck = deck;
    },

    init: function() {
        Model.init();
        View.init();
    }
}

Octo.init();

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
