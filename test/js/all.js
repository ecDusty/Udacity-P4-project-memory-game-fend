'use strict';

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

var Model = {

    createCard: function createCard(card) {
        var baseCard = document.createElement('li');
        var image = document.createElement('img');
        baseCard.subEl = document.createElement('i');

        image.src = '../images/geometry2.png';
        image.alt = 'Invisible image used to keep items square';

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

        return baseCard;
    },

    shuffle: function shuffle(array) {
        // Shuffle function from http://stackoverflow.com/a/2450976
        var currentIndex = array.length,
            temporaryValue,
            randomIndex;

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
    buildDeck: function buildDeck() {
        var startDeck = [];
        var that = this;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var card = _step.value;

                startDeck.push(that.createCard(card));
                startDeck.push(that.createCard(card));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        this.deck = this.shuffle(startDeck);
    },

    //This runs on game start.
    init: function init() {
        //If a browser has local game storage, than load that instead of creating a new game.
        // LOCAL STORGAE ABILITY HASN"T BEEN BUILT YET.
        if (localStorage.getItem('ecmMemGame')) {
            var game = localStorage.getItem('ecmMemGame');
            this.moves = game.moves;
            this.lives = game.lives;
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
            this.activeCard = game.activeCard;
            this.numMatched = game.numMatched;
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
            this.moves = 0;
            this.lives = 3;
            this.time = {
                start: false,
                hr: 0,
                min: 0,
                sec: 0,
                tiny: 0
            };
            this.recordTime = 0;
            this.numMatched = 0;
            this.activeCard = [null];
            this.win = false;
            this.buildDeck();
        }
    }
};

var View = {

    gameStart: false, //Used to see if game is on it's first start round

    //Clock view update
    updateTime: function updateTime(timer) {
        var min = timer.min < 10 ? '0' + timer.min : timer.min;
        var sec = timer.sec < 10 ? '0' + timer.sec : timer.sec;
        var tiny = timer.tiny < 10 ? '0' + timer.tiny : timer.tiny;
        document.getElementsByClassName('timer')[0].innerHTML = min + ':' + sec + '.' + tiny;
    },

    //Hide and show the win game sign
    hideWin: function hideWin() {
        document.getElementById('winning').className = 'display-none';
    },

    showWin: function showWin() {
        document.getElementById('winning').classList.add('show');
    },

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    loseStar: function loseStar(n) {
        this.stars[n].remove();
    },

    changeMoves: function changeMoves(moves) {
        document.getElementsByClassName('moves')[0].innerHTML = moves;
    },

    //Hide card
    hideCards: function hideCards() {
        for (var _len = arguments.length, cards = Array(_len), _key = 0; _key < _len; _key++) {
            cards[_key] = arguments[_key];
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var card = _step2.value;

                card.cardShow = false;
                card.classList.remove('show');
                card.classList.remove('wrong');
                card.classList.remove('match');
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },

    //The wrong pair of cards are selected, then run this function
    wrongCards: function wrongCards(card1, card2) {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
        Octo.resetActiveCard();
    },

    init: function init() {
        this.stars = [];
        Octo.setWin(false);
        //Check if this is the games first start, if so assign Elements to View parameters
        if (!this.gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('restart');
            this.resetButton.addEventListener('click', function () {
                Octo.reset();
            });
        }

        //Reset the deck
        this.theDeck.innerHTML = '';
        this.wrongSet = false;

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Octo.getDeck()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var card = _step3.value;

                card.addEventListener('click', function (e) {
                    var el = e.currentTarget;
                    Octo.cardCheck(el);
                });

                this.theDeck.appendChild(card);
            }

            //Create Stars
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var lStars = document.getElementsByClassName('stars')[0];
        lStars.innerHTML = '';

        for (var i = 0; i < Octo.getLives(); i++) {
            var lItem = document.createElement('li');
            var icon = document.createElement('i');
            icon.className = 'fa fa-star';
            lItem.appendChild(icon);
            lStars.appendChild(lItem);
            this.stars.push(lItem);
        }

        this.hideWin();

        //Set Moves number
        document.getElementsByClassName('moves')[0].innerHTML = Octo.getMoves();
        this.gameStart = true;
    }
};

var Octo = {

    //Show the winning sign.
    winGame: function winGame() {
        View.showWin();
        Model.time.start = false;
    },

    //Set the wine tracking property
    setWin: function setWin(x) {
        Model.win = x;
    },

    resetMoves: function resetMoves() {
        Model.moves = 0;
    },

    //Return moves
    getMoves: function getMoves() {
        return Model.moves;
    },

    //Return lives
    getLives: function getLives() {
        return Model.lives;
    },

    //Return lives
    updateLives: function updateLives() {
        if (Model.moves < 20) {
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
    updateMoves: function updateMoves() {
        Model.moves++;
        View.changeMoves(Model.moves);
    },

    //reset flipped cards array
    resetActiveCard: function resetActiveCard() {
        Model.activeCard = [];
    },

    //Set flipped cards
    setActiveCard: function setActiveCard(card1, card2) {
        card2 ? Model.activeCard = [card1, card2] : Model.activeCard = [card1];
    },

    //Get current flipped card
    getActiveCard: function getActiveCard() {
        return Model.activeCard;
    },

    //Get the current array of cards
    getDeck: function getDeck() {
        return Model.deck;
    },

    //Set the current deck
    setDeck: function setDeck(deck) {
        Model.deck = deck;
    },

    resetDeck: function resetDeck() {
        Model.buildDeck();
    },

    setWrong: function setWrong(card1, card2) {
        View.wrongSet = true;
        View.wrongCards(card1, card2);

        setTimeout(function () {
            View.hideCards(card1, card2);
            Octo.resetActiveCard();
            View.wrongSet = false;
        }, 1300);
    },

    matched: function matched(card1, card2) {
        View.setMatched(card1, card2);
        Model.numMatched++;
        if (Model.numMatched == Model.cards.length) this.winGame();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = this.getActiveCard();

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
                        this.setActiveCard(activeC[0], card);

                        card.card === activeC[0].card ? this.matched(card, activeC[0]) : this.setWrong(card, activeC[0]);
                    } else {
                        this.setActiveCard(card);
                    }
                }
            }
        }
    },

    startTimer: function startTimer(timer) {
        Model.time.start = true;

        function clock() {
            if (Model.time.start) {
                timer.tiny++;
                if (timer.tiny === 100) {
                    timer.tiny = 0;
                    timer.sec++;

                    if (timer.sec === 60) {
                        timer.sec = 0;
                        timer.min++;
                    }
                }
                View.updateTime(timer);
                setTimeout(clock, 10);
            }
        }

        setTimeout(clock, 10);
    },

    reset: function reset() {
        this.resetMoves();
        this.resetDeck();
        this.resetActiveCard();
        Model.time.start = false;
        Model.time.min = 0;
        Model.time.sec = 0;
        Model.time.tiny = 0;
        View.updateTime(Model.time);
        View.init();
    },

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpbWFnZSIsInN1YkVsIiwic3JjIiwiYWx0IiwibWF0Y2giLCJjYXJkU2hvdyIsImNsYXNzTmFtZSIsImRhdGFzZXQiLCJpdGVtIiwiYXBwZW5kQ2hpbGQiLCJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJsZW5ndGgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiYnVpbGREZWNrIiwic3RhcnREZWNrIiwidGhhdCIsImNhcmRzIiwicHVzaCIsImRlY2siLCJpbml0IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImdhbWUiLCJtb3ZlcyIsImxpdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwibnVtTWF0Y2hlZCIsInN0YXJ0IiwiaHIiLCJtaW4iLCJzZWMiLCJ0aW55Iiwid2luIiwiVmlldyIsImdhbWVTdGFydCIsInVwZGF0ZVRpbWUiLCJ0aW1lciIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJoaWRlV2luIiwiZ2V0RWxlbWVudEJ5SWQiLCJzaG93V2luIiwiY2xhc3NMaXN0IiwiYWRkIiwibG9zZVN0YXIiLCJuIiwic3RhcnMiLCJyZW1vdmUiLCJjaGFuZ2VNb3ZlcyIsImhpZGVDYXJkcyIsIndyb25nQ2FyZHMiLCJjYXJkMSIsImNhcmQyIiwic2V0TWF0Y2hlZCIsIk9jdG8iLCJyZXNldEFjdGl2ZUNhcmQiLCJzZXRXaW4iLCJ0aGVEZWNrIiwicmVzZXRCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwibFN0YXJzIiwiaSIsImdldExpdmVzIiwibEl0ZW0iLCJpY29uIiwiZ2V0TW92ZXMiLCJ3aW5HYW1lIiwieCIsInJlc2V0TW92ZXMiLCJ1cGRhdGVMaXZlcyIsInVwZGF0ZU1vdmVzIiwic2V0QWN0aXZlQ2FyZCIsImdldEFjdGl2ZUNhcmQiLCJzZXREZWNrIiwicmVzZXREZWNrIiwic2V0V3JvbmciLCJzZXRUaW1lb3V0IiwibWF0Y2hlZCIsImFjdGl2ZUMiLCJzdGFydFRpbWVyIiwiY2xvY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQTs7Ozs7OztBQVFBOztBQUVBOztBQUVBLElBQU1BLFFBQVE7O0FBRVZDLGdCQUFZLG9CQUFTQyxJQUFULEVBQWU7QUFDdkIsWUFBTUMsV0FBV0MsU0FBU0MsYUFBVCxDQUF1QixJQUF2QixDQUFqQjtBQUNBLFlBQU1DLFFBQVFGLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZDtBQUNBRixpQkFBU0ksS0FBVCxHQUFpQkgsU0FBU0MsYUFBVCxDQUF1QixHQUF2QixDQUFqQjs7QUFFQUMsY0FBTUUsR0FBTjtBQUNBRixjQUFNRyxHQUFOOztBQUVBO0FBQ0FOLGlCQUFTRCxJQUFULEdBQWdCQSxJQUFoQjs7QUFFQTtBQUNBQyxpQkFBU08sS0FBVCxHQUFpQixLQUFqQjs7QUFFQTtBQUNBUCxpQkFBU1EsUUFBVCxHQUFvQixLQUFwQjs7QUFFQTtBQUNBUixpQkFBU1MsU0FBVCxHQUFxQixNQUFyQjtBQUNBVCxpQkFBU1UsT0FBVCxDQUFpQkMsSUFBakIsR0FBd0JaLElBQXhCO0FBQ0FDLGlCQUFTSSxLQUFULENBQWVLLFNBQWYsR0FBMkIsV0FBV1YsSUFBdEM7QUFDQUMsaUJBQVNZLFdBQVQsQ0FBcUJaLFNBQVNJLEtBQTlCO0FBQ0FKLGlCQUFTWSxXQUFULENBQXFCVCxLQUFyQjs7QUFFQSxlQUFPSCxRQUFQO0FBQ0gsS0EzQlM7O0FBNkJWYSxhQUFTLGlCQUFTQyxLQUFULEVBQWdCO0FBQ3JCO0FBQ0EsWUFBSUMsZUFBZUQsTUFBTUUsTUFBekI7QUFBQSxZQUFpQ0MsY0FBakM7QUFBQSxZQUFpREMsV0FBakQ7O0FBRUEs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Qk0sOEJBQU1OLEdBQU4sR0FBWSxDQUFaO0FBQ0FNLDhCQUFNUCxHQUFOO0FBQ0g7QUFDSjtBQUNESSxxQkFBS0UsVUFBTCxDQUFnQkMsS0FBaEI7QUFDQStDLDJCQUFXSSxLQUFYLEVBQWlCLEVBQWpCO0FBQ0g7QUFDSjs7QUFFREosbUJBQVdJLEtBQVgsRUFBaUIsRUFBakI7QUFDSCxLQXBKUTs7QUFzSlQzQixXQUFPLGlCQUFXO0FBQ2QsYUFBS2UsVUFBTDtBQUNBLGFBQUtNLFNBQUw7QUFDQSxhQUFLMUIsZUFBTDtBQUNBckUsY0FBTXFDLElBQU4sQ0FBV0ksS0FBWCxHQUFtQixLQUFuQjtBQUNBekMsY0FBTXFDLElBQU4sQ0FBV00sR0FBWCxHQUFpQixDQUFqQjtBQUNBM0MsY0FBTXFDLElBQU4sQ0FBV08sR0FBWCxHQUFpQixDQUFqQjtBQUNBNUMsY0FBTXFDLElBQU4sQ0FBV1EsSUFBWCxHQUFrQixDQUFsQjtBQUNBRSxhQUFLRSxVQUFMLENBQWdCakQsTUFBTXFDLElBQXRCO0FBQ0FVLGFBQUtoQixJQUFMO0FBQ0gsS0FoS1E7O0FBa0tUQSxVQUFNLGdCQUFXO0FBQ2IvQixjQUFNK0IsSUFBTjtBQUNBZ0IsYUFBS2hCLElBQUw7QUFDSDtBQXJLUSxDQUFiOztBQXdLQXFDLEtBQUtyQyxJQUFMIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGNvbnN0IGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblxyXG4gICAgICAgIGltYWdlLnNyYyA9IGAuLi9pbWFnZXMvZ2VvbWV0cnkyLnBuZ2A7XHJcbiAgICAgICAgaW1hZ2UuYWx0ID0gYEludmlzaWJsZSBpbWFnZSB1c2VkIHRvIGtlZXAgaXRlbXMgc3F1YXJlYDtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgICAgICAvLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlY2sgPSB0aGlzLnNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vSWYgYSBicm93c2VyIGhhcyBsb2NhbCBnYW1lIHN0b3JhZ2UsIHRoYW4gbG9hZCB0aGF0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgZ2FtZS5cclxuICAgICAgICAvLyBMT0NBTCBTVE9SR0FFIEFCSUxJVFkgSEFTTlwiVCBCRUVOIEJVSUxUIFlFVC5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMubGl2ZXMgPSBnYW1lLmxpdmVzXHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBnYW1lLmFjdGl2ZUNhcmQ7XHJcbiAgICAgICAgICAgIHRoaXMubnVtTWF0Y2hlZCA9IGdhbWUubnVtTWF0Y2hlZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubGl2ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBocjogMCxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIHNlYzogMCxcclxuICAgICAgICAgICAgICAgIHRpbnk6IDAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm51bU1hdGNoZWQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBbbnVsbF07XHJcbiAgICAgICAgICAgIHRoaXMud2luID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGREZWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBWaWV3ID0ge1xyXG5cclxuICAgIGdhbWVTdGFydDogZmFsc2UsIC8vVXNlZCB0byBzZWUgaWYgZ2FtZSBpcyBvbiBpdCdzIGZpcnN0IHN0YXJ0IHJvdW5kXHJcblxyXG4gICAgLy9DbG9jayB2aWV3IHVwZGF0ZVxyXG4gICAgdXBkYXRlVGltZTogZnVuY3Rpb24odGltZXIpIHtcclxuICAgICAgICBjb25zdCBtaW4gPSB0aW1lci5taW4gPCAxMCA/ICcwJyArIHRpbWVyLm1pbiA6IHRpbWVyLm1pbjtcclxuICAgICAgICBjb25zdCBzZWMgPSB0aW1lci5zZWMgPCAxMCA/ICcwJyArIHRpbWVyLnNlYyA6IHRpbWVyLnNlYztcclxuICAgICAgICBjb25zdCB0aW55ID0gdGltZXIudGlueSA8IDEwID8gJzAnICsgdGltZXIudGlueSA6IHRpbWVyLnRpbnlcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0aW1lcicpWzBdLmlubmVySFRNTCA9IG1pbiArICc6JyArIHNlYyArICcuJyArIHRpbnk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vSGlkZSBhbmQgc2hvdyB0aGUgd2luIGdhbWUgc2lnblxyXG4gICAgaGlkZVdpbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dpbm5pbmcnKS5jbGFzc05hbWUgPSAnZGlzcGxheS1ub25lJztcclxuICAgIH0sXHJcbiAgICBcclxuICAgIHNob3dXaW46IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3aW5uaW5nJykuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0luaXRpYWxpemF0aW9uIG9mIHRoZSBnYW1lIHZpZXcsIHBsYWNlcyBlbGVtZW50cyBpbiB0aGUgRE9NICYgYWRkaW5nIGV2ZW50IGxpc3RlbmVycy5cclxuICAgIGxvc2VTdGFyOiBmdW5jdGlvbihuKSB7XHJcbiAgICAgICAgdGhpcy5zdGFyc1tuXS5yZW1vdmUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2hhbmdlTW92ZXM6IGZ1bmN0aW9uKG1vdmVzKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbW92ZXMnKVswXS5pbm5lckhUTUwgPSBtb3ZlcztcclxuICAgIH0sXHJcblxyXG4gICAgLy9IaWRlIGNhcmRcclxuICAgIGhpZGVDYXJkczogZnVuY3Rpb24oLi4uY2FyZHMpIHtcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnd3JvbmcnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdtYXRjaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRjaGVkOiBmdW5jdGlvbihjYXJkMSwgY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQxLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQyLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0YXJzID0gW107XHJcbiAgICAgICAgT2N0by5zZXRXaW4oZmFsc2UpO1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIE9jdG8ucmVzZXQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1Jlc2V0IHRoZSBkZWNrXHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9IGBgO1xyXG4gICAgICAgIHRoaXMud3JvbmdTZXQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIE9jdG8uY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9DcmVhdGUgU3RhcnNcclxuICAgICAgICBjb25zdCBsU3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzdGFycycpWzBdXHJcbiAgICAgICAgbFN0YXJzLmlubmVySFRNTCA9IGBgO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE9jdG8uZ2V0TGl2ZXMoKTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxJdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuICAgICAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBgZmEgZmEtc3RhcmA7XHJcbiAgICAgICAgICAgIGxJdGVtLmFwcGVuZENoaWxkKGljb24pO1xyXG4gICAgICAgICAgICBsU3RhcnMuYXBwZW5kQ2hpbGQobEl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJzLnB1c2gobEl0ZW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oaWRlV2luKCk7XHJcblxyXG4gICAgICAgIC8vU2V0IE1vdmVzIG51bWJlclxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vdmVzJylbMF0uaW5uZXJIVE1MID0gT2N0by5nZXRNb3ZlcygpO1xyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICAvL1Nob3cgdGhlIHdpbm5pbmcgc2lnbi5cclxuICAgIHdpbkdhbWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFZpZXcuc2hvd1dpbigpO1xyXG4gICAgICAgIE1vZGVsLnRpbWUuc3RhcnQgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIHdpbmUgdHJhY2tpbmcgcHJvcGVydHlcclxuICAgIHNldFdpbjogZnVuY3Rpb24oeCkge1xyXG4gICAgICAgIE1vZGVsLndpbiA9IHg7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0TW92ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzID0gMDtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIGxpdmVzXHJcbiAgICBnZXRMaXZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmxpdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBsaXZlc1xyXG4gICAgdXBkYXRlTGl2ZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKE1vZGVsLm1vdmVzIDwgMjApIHtcclxuICAgICAgICAgICAgTW9kZWwubGl2ZXMgPSAzO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoTW9kZWwubW92ZXMgPCAyOSkge1xyXG4gICAgICAgICAgICBNb2RlbC5saXZlcyA9IDI7XHJcbiAgICAgICAgICAgIFZpZXcubG9zZVN0YXIoTW9kZWwubGl2ZXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIE1vZGVsLmxpdmVzID0gMTtcclxuICAgICAgICAgICAgVmlldy5sb3NlU3RhcihNb2RlbC5saXZlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL1VwZGF0ZSBTdGFyICYgbW92ZSBudW1iZXJcclxuICAgIHVwZGF0ZU1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcysrO1xyXG4gICAgICAgIFZpZXcuY2hhbmdlTW92ZXMoTW9kZWwubW92ZXMpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL3Jlc2V0IGZsaXBwZWQgY2FyZHMgYXJyYXlcclxuICAgIHJlc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCBmbGlwcGVkIGNhcmRzXHJcbiAgICBzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQyID8gTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl0gOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0V3Jvbmc6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgVmlldy53cm9uZ1NldCA9IHRydWU7XHJcbiAgICAgICAgVmlldy53cm9uZ0NhcmRzKGNhcmQxLGNhcmQyKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgVmlldy5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICBWaWV3Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMTMwMCk7XHJcbiAgICB9LFxyXG5cclxuICAgIG1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgVmlldy5zZXRNYXRjaGVkKGNhcmQxLGNhcmQyKTtcclxuICAgICAgICBNb2RlbC5udW1NYXRjaGVkKytcclxuICAgICAgICBpZiAoTW9kZWwubnVtTWF0Y2hlZCA9PSBNb2RlbC5jYXJkcy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHRoaXMud2luR2FtZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0NoZWNrIHdoYXQgdGhlIGNhcmQgLyBjYXJkcyBhcmUgc2V0IGFzLCBhbmQgYWN0IGFjY29yZGluZ2x5LlxyXG4gICAgY2FyZENoZWNrOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQyA9IHRoaXMuZ2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICghTW9kZWwudGltZS5zdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZXIoTW9kZWwudGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWNhcmQubWF0Y2ggJiYgdGhpcy5nZXRMaXZlcygpICYmICFWaWV3Lndyb25nU2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTW92ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMaXZlcygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIFZpZXcuaGlkZUNhcmRzKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZCA9PT0gYWN0aXZlQ1swXS5jYXJkID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnNldFdyb25nKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc3RhcnRUaW1lcjogZnVuY3Rpb24odGltZXIpIHtcclxuICAgICAgICBNb2RlbC50aW1lLnN0YXJ0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xvY2soKSB7XHJcbiAgICAgICAgICAgIGlmKE1vZGVsLnRpbWUuc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgIHRpbWVyLnRpbnkrK1xyXG4gICAgICAgICAgICAgICAgaWYgKHRpbWVyLnRpbnkgPT09IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyLnRpbnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyLnNlYysrO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWVyLnNlYyA9PT0gNjApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIuc2VjID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXIubWluKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgVmlldy51cGRhdGVUaW1lKHRpbWVyKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChjbG9jaywxMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoY2xvY2ssMTApO1xyXG4gICAgfSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldERlY2soKTtcclxuICAgICAgICB0aGlzLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgIE1vZGVsLnRpbWUuc3RhcnQgPSBmYWxzZTtcclxuICAgICAgICBNb2RlbC50aW1lLm1pbiA9IDA7XHJcbiAgICAgICAgTW9kZWwudGltZS5zZWMgPSAwO1xyXG4gICAgICAgIE1vZGVsLnRpbWUudGlueSA9IDA7XHJcbiAgICAgICAgVmlldy51cGRhdGVUaW1lKE1vZGVsLnRpbWUpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuIl19
