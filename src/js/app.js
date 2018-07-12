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
            this.activeCard = game.activeCard
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
            this.moves = 3;
            this.time = 0;
            this.recordTime = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
}

const View = {

    gameStart: false, //Used to see if game is on it's first start round

    reset: function() {
        Octo.resetMoves();
        Octo.resetDeck();
        this.init();
    },

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    loseStar: function() {

    },


    //Hide card
    hideCards: function(...cards) {
        for (var card of cards) {
            card.cardShow = false;
            card.classList.remove('show');
            card.classList.remove('wrong');
            card.classList.remove('match');
        }
    },

    //The wrong pair of cards are selected, then run this function
    wrongCards: function(card1,card2) {
        const that = this;
        that.wrongSet = true;

        card1.classList.add('wrong');
        card2.classList.add('wrong');

        setTimeout(function() {
            that.hideCards(card1,card2);
            Octo.resetActiveCard();
            that.wrongSet = false;
        }, 3000);

        Octo.loseMove();
        this.updateStars();
    },

    setMatched: function(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
        Octo.resetActiveCard();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function(card) {
        const activeC = Octo.getActiveCard();

        if (!card.match && Octo.getMoves() && !this.wrongSet) {
            if (card.cardShow) {
                this.hideCards(card);
                Octo.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');

                    if (activeC[0]) {
                        Octo.setActiveCard(activeC[0],card);
                        
                        card.card === activeC[0].card ? 
                            this.setMatched(card,activeC[0])
                            : this.wrongCards(card,activeC[0]);
                    } else {
                        Octo.setActiveCard(card);
                    }

                }
            }
        }
    },

    init: function() {
        const that = this;

        //Check if this is the games first start, if so assign Elements to View parameters
        if (!gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('reset');
            
            resetButton.addEventListener('click', function() {
                that.reset();
            });
        }

        //Reset the deck
        this.theDeck.innerHTML = '';
        this.wrongSet = false;

        for (var card of Octo.getDeck()){
            card.addEventListener('click', function(e) {
                const el = e.currentTarget;
                that.cardCheck(el);
            }); 

            this.theDeck.appendChild(card);
        }

        gameStart = true;
    }
}

const Octo = {

    resetMoves: function() {
        Model.moves = 3;
    },

    //Return moves
    loseMove: function() {
        Model.moves--;
    },

    //Return moves
    getMoves: function() {
        return Model.moves;
    },

    //reset flipped cards array
    resetActiveCard: function() {
        Model.activeCard = [];
    },

    //Set flipped cards
    setActiveCard: function(card1,card2) {
        card2 ? 
            Model.activeCard = [card1,card2]
            : Model.activeCard = [card1];
    },

    //Get current flipped card
    getActiveCard: function() {
        return Model.activeCard;
    },

    //Get the current array of cards
    getDeck: function() {
        return Model.deck;
    },

    //Set the current deck
    setDeck: function(deck) {
        Model.deck = deck;
    },

    resetDeck: function() {
        Model.buildDeck();
    },

    init: function() {
        Model.init();
        View.init();
    }
}

Octo.init();

