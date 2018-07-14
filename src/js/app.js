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
        const image = document.createElement('img');
        baseCard.subEl = document.createElement('i');

        image.src = `images/geometry2.png`;
        image.alt = `Invisible image used to keep items square`;

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
        baseCard.appendChild(image);

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
            this.lives = game.lives
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
            this.activeCard = game.activeCard;
            this.numMatched = game.numMatched;
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
            this.moves = 0;
            this.lives = 3;
            this.time = {
                start: false,
                hr: 0,
                min: 0,
                sec: 0,
                tiny: 0   
            };
            this.recordTime = {
                hr: 0,
                min: 0,
                sec: 0,
                tiny: 0   
            };
            this.numMatched = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
}

const View = {

    gameStart: false, //Used to see if game is on it's first start round

    //Clock view update
    tFormatText: function(min,sec,tiny) {
        return min + ':' + sec + '.' + tiny;
    },

    updateTime: function(timer) {
        const min = timer.min < 10 ? '0' + timer.min : timer.min;
        const sec = timer.sec < 10 ? '0' + timer.sec : timer.sec;
        const tiny = timer.tiny < 10 ? '0' + timer.tiny : timer.tiny
        document.getElementsByClassName('timer')[0].innerHTML = this.tFormatText(min,sec,tiny);
    },

    //Hide and show the win game sign
    hideWin: function() {
        document.getElementById('winning').className = 'display-none';
    },
    
    showWin: function() {
        const cTime = document.getElementsByClassName('current-time')[0].getElementsByClassName('final-time')[0]
        const rTime = document.getElementsByClassName('record-time')[0].getElementsByClassName('final-time')[0]
        const dCTime = Octo.getTime();
        const dRTime = Octo.getRecordTime();
        const stars = document.getElementsByClassName('rating')[0].getElementsByClassName('star-rating')[0];

        //Set time on winning cared
        cTime.innerHTML = this.tFormatText(dCTime.min,dCTime.sec,dCTime.tiny);
        rTime.innerHTML = this.tFormatText(dRTime.min,dRTime.sec,dRTime.tiny);

        //Add stars to win card
        for (var i = 0; i < Octo.getLives();i++) {
            const star = document.createElement('i')
            star.classList.add('fa','fa-star');
            stars.appendChild(star);
        }

        document.getElementById('winning').classList.add('show');

        


    },

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    loseStar: function(n) {
        this.stars[n].remove();
    },

    changeMoves: function(moves) {
        document.getElementsByClassName('moves')[0].innerHTML = moves;
    },

    //Hide card
    hideCards: function(...cards) {
        for (var card of cards) {
            card.cardShow = false;
            card.classList.remove('show','wrong','match');
        }
    },

    //The wrong pair of cards are selected, then run this function
    wrongCards: function(card1,card2) {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
    },

    setMatched: function(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
        Octo.resetActiveCard();
    },

    init: function() {
        this.stars = [];
        //Check if this is the games first start, if so assign Elements to View parameters
        if (!this.gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('restart');
            this.resetButton.addEventListener('click', function() {
                Octo.reset();
            });
        }

        //Reset the deck
        this.theDeck.innerHTML = ``;
        this.wrongSet = false;

        for (var card of Octo.getDeck()){
            card.addEventListener('click', function(e) {
                const el = e.currentTarget;
                Octo.cardCheck(el);
            }); 

            this.theDeck.appendChild(card);
        }

        //Create Stars
        const lStars = document.getElementsByClassName('stars')[0]
        lStars.innerHTML = ``;

        for (var i = 0; i < Octo.getLives(); i++) {
            const lItem = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = `fa fa-star`;
            lItem.appendChild(icon);
            lStars.appendChild(lItem);
            this.stars.push(lItem);
        }

        this.hideWin();

        //Set Moves number
        document.getElementsByClassName('moves')[0].innerHTML = Octo.getMoves();
        this.gameStart = true;
    }
}

const Octo = {

    //Show the winning sign.
    winGame: function() {
        if (Model.time.min < Model.recordTime.min) {
            this.setRecordTime();
        } else if (Model.time.min == Model.recordTime.min && Model.time.sec < Model.recordTime.sec) {
            this.setRecordTime();
        } else if (Model.time.tiny < Model.recordTime.tiny && Model.time.min == Model.recordTime.min && Model.time.sec == Model.recordTime.sec) {
            this.setRecordTime();
        }

        View.showWin();
        Model.time.start = false;
    },

    setRecordTime: function() {
        Model.recordTime.min = Model.time.min;
        Model.recordTime.sec = Model.time.sec;
        Model.recordTime.tiny = Model.time.tiny;
    },

    getTime: function() {
        return Model.time;
    },

    getRecordTime: function() {
        return Model.recordTime;
    },

    resetMoves: function() {
        Model.moves = 0;
    },

    //Return moves
    getMoves: function() {
        return Model.moves;
    },

    //Return lives
    getLives: function() {
        return Model.lives;
    },

    //Return lives
    updateLives: function() {
        if(Model.moves < 20) {
            Model.lives = 3;
        } else if (Model.moves < 29) {
            Model.lives = 2;
            View.loseStar(Model.lives);
        } else {
            Model.lives = 1;
            View.loseStar(Model.lives);
        }
    },

    //Update Star & move number
    updateMoves: function() {
        Model.moves++;
        View.changeMoves(Model.moves);
    },

    //reset flipped cards array
    resetActiveCard: function() {
        Model.activeCard = [];
    },

    //Set flipped cards
    setActiveCard: function(card1,card2) {
        card2 ? Model.activeCard = [card1,card2] : Model.activeCard = [card1];
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

    setWrong: function(card1,card2) {
        View.wrongSet = true;
        View.wrongCards(card1,card2);

        setTimeout(function() {
            View.hideCards(card1,card2);
            Octo.resetActiveCard();
            View.wrongSet = false;
        }, 1300);
    },

    matched: function(card1,card2) {
        View.setMatched(card1,card2);
        Model.numMatched++
        if (Model.numMatched == Model.cards.length)
            this.winGame();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function(card) {
        const activeC = this.getActiveCard();
        
        if (!Model.time.start) {
            this.startTimer(Model.time);
        }

        if (!card.match && this.getLives() && !View.wrongSet) {
            this.updateMoves();
            this.updateLives();

            if (card.cardShow) {
                View.hideCards(card);
                this.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');

                    if (activeC[0]) {
                        this.setActiveCard(activeC[0],card);
                        
                        card.card === activeC[0].card ? 
                            this.matched(card,activeC[0])
                            : this.setWrong(card,activeC[0]);
                    } else {
                        this.setActiveCard(card);
                    }
                }
            }
        }
    },

    startTimer: function(timer) {
        Model.time.start = true;

        function clock() {
            if(Model.time.start) {
                timer.tiny++
                if (timer.tiny === 100) {
                    timer.tiny = 0;
                    timer.sec++;
    
                    if (timer.sec === 60) {
                        timer.sec = 0;
                        timer.min++;
                    }
                }
                View.updateTime(timer)
                setTimeout(clock,10);
            }
        }

        setTimeout(clock,10);
    },

    reset: function() {
        this.resetMoves();
        this.resetDeck();
        this.resetActiveCard();
        Model.lives = 3;
        Model.time.start = false;
        Model.time.min = 0;
        Model.time.sec = 0;
        Model.time.tiny = 0;
        View.updateTime(Model.time);
        View.init();
    },

    init: function() {
        Model.init();
        View.init();
    }
}

Octo.init();

