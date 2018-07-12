/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// MY ATTEMPT to build this in a MOV format

// The model holds all the games data.

const Model = {

    createCard: function(card) {
        const baseCard = document.createElement('li');
        baseCard.subEl = document.createElement('i');

        //Place the name of the card with the Object element
        baseCard.card = card;

        //Has the card been matched up? This makes it easily accessable throughout the game
        baseCard.match = false;
        //Tells whether the card is showing or not
        baseCard.cardShow = false;

        //Setup the card DOM structure and attributes.
        baseCard.className = 'card';
        baseCard.dataset.item = card;
        baseCard.subEl.className = 'fa fa-' + card;
        baseCard.appendChild(baseCard.subEl);

        return baseCard
    },

    shuffle: function(array) {
        // Shuffle function from http://stackoverflow.com/a/2450976
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    //Builds out the card deck elements into an easy to access array
    buildDeck: function() {
        let startDeck = [];
        const that = this;

        for (var card of this.cards) {
            startDeck.push(that.createCard(card));
            startDeck.push(that.createCard(card));
        }

        this.deck = this.shuffle(startDeck);
    },

    //This runs on game start.
    init: function() {
        //If a browser has local game storage, than load that instead of creating a new game.
        // LOCAL STORGAE ABILITY HASN"T BEEN BUILT YET.
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
    //Initialization of the game view, places elements in the DOM & adding event listeners.
    updateStars: function() {

    },

    //The wrong pair of cards are selected, then run this function
    wrongCards: function() {

    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function(card) {
        if (!card.match) {
            if (card.cardShow) {
                card.cardShow = false;
                card.classList.remove('show');
            } else {
                card.cardShow = true;
                card.classList.add('show');
            }
        }
    },

    init: function() {
        const that = this;
        this.theDeck = document.getElementsByClassName('deck')[0];
        this.theDeck.innerHTML = '';

        for (var card of Octo.getDeck()){
            card.addEventListener('click', function(e) {
                const el = e.currentTarget;
                that.cardCheck(el);
            }); 
            this.theDeck.appendChild(card);
        }
    }
}

const Octo = {
    //Get the current array of cards
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
