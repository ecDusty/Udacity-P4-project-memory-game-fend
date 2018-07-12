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
            this.time = game.time;
            this.recordTime = game.recordTime;
            this.cards = game.cards;
            this.deck = game.deck;
            this.activeCard = game.activeCard;
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];
            this.moves = 3;
            this.time = 0;
            this.recordTime = 0;
            this.activeCard = [null];
            this.buildDeck();
        }
    }
};

var View = {
    reset: function reset() {
        Octo.resetMoves();
    },

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    updateStars: function updateStars() {},

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
        var that = this;
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        setTimeout(function () {
            that.hideCards(card1, card2);
            Octo.resetActiveCard();
        }, 3000);
        Octo.loseMove();
        this.updateStars();
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
        Octo.resetActiveCard();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = Octo.getActiveCard();

        if (!card.match && Octo.getMoves()) {
            if (card.cardShow) {
                this.hideCards(card);
                Octo.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');
                    if (activeC[0]) {
                        Octo.setActiveCard(activeC[0], card);
                        if (card.card === activeC[0].card) {
                            this.setMatched(card, activeC[0]);
                        } else {
                            this.wrongCards(card, activeC[0]);
                        }
                    } else {
                        Octo.setActiveCard(card);
                    }
                }
            }
        }
    },

    init: function init() {
        var that = this;
        this.theDeck = document.getElementsByClassName('deck')[0];
        this.theDeck.innerHTML = '';

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = Octo.getDeck()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var card = _step3.value;

                card.addEventListener('click', function (e) {
                    var el = e.currentTarget;
                    that.cardCheck(el);
                });
                this.theDeck.appendChild(card);
            }
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
    }
};

var Octo = {

    resetMoves: function resetMoves() {
        Model.moves = 3;
    },

    //Return moves
    loseMove: function loseMove() {
        Model.moves--;
    },

    //Return moves
    getMoves: function getMoves() {
        return Model.moves;
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

    init: function init() {
        Model.init();
        View.init();
    }
};

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwicmVzZXQiLCJPY3RvIiwicmVzZXRNb3ZlcyIsInVwZGF0ZVN0YXJzIiwiaGlkZUNhcmRzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJhZGQiLCJzZXRUaW1lb3V0IiwicmVzZXRBY3RpdmVDYXJkIiwibG9zZU1vdmUiLCJzZXRNYXRjaGVkIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsImdldEFjdGl2ZUNhcmQiLCJnZXRNb3ZlcyIsInNldEFjdGl2ZUNhcmQiLCJ0aGVEZWNrIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlubmVySFRNTCIsImdldERlY2siLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImVsIiwiY3VycmVudFRhcmdldCIsInNldERlY2siLCJyZXNldERlY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQTs7Ozs7OztBQVFBOztBQUVBOztBQUVBLElBQU1BLFFBQVE7O0FBRVZDLGdCQUFZLG9CQUFTQyxJQUFULEVBQWU7QUFDdkIsWUFBTUMsV0FBV0MsU0FBU0MsYUFBVCxDQUF1QixJQUF2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O0FBQ3BCM0IsY0FBTTJCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBeENROztBQTBDVHVDLGVBQVcscUJBQVc7QUFDbEJsRSxjQUFNc0IsU0FBTjtBQUNILEtBNUNROztBQThDVE0sVUFBTSxnQkFBVztBQUNiNUIsY0FBTTRCLElBQU47QUFDQVEsYUFBS1IsSUFBTDtBQUNIO0FBakRRLENBQWI7O0FBb0RBVSxLQUFLVixJQUFMOztBQUVBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldHVwIHRoZSBjYXJkIERPTSBzdHJ1Y3R1cmUgYW5kIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGJhc2VDYXJkLmRhdGFzZXQuaXRlbSA9IGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGJhc2VDYXJkLnN1YkVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLiByZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBPY3RvLnJlc2V0TW92ZXMoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGF0LmhpZGVDYXJkcyhjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgT2N0by5sb3NlTW92ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3RhcnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSBPY3RvLmdldEFjdGl2ZUNhcmQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoICYmIE9jdG8uZ2V0TW92ZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FyZHMoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXJkLmNhcmQgPT09IGFjdGl2ZUNbMF0uY2FyZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgcmVzZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMgPSAzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBtb3Zlc1xyXG4gICAgbG9zZU1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzLS07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL3Jlc2V0IGZsaXBwZWQgY2FyZHMgYXJyYXlcclxuICAgIHJlc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCBmbGlwcGVkIGNhcmRzXHJcbiAgICBzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQyID8gTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbi8qXHJcbiAqIHNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIGEgY2FyZC4gSWYgYSBjYXJkIGlzIGNsaWNrZWQ6XHJcbiAqICAtIGRpc3BsYXkgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGFkZCB0aGUgY2FyZCB0byBhICpsaXN0KiBvZiBcIm9wZW5cIiBjYXJkcyAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gaWYgdGhlIGxpc3QgYWxyZWFkeSBoYXMgYW5vdGhlciBjYXJkLCBjaGVjayB0byBzZWUgaWYgdGhlIHR3byBjYXJkcyBtYXRjaFxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBtYXRjaCwgbG9jayB0aGUgY2FyZHMgaW4gdGhlIG9wZW4gcG9zaXRpb24gKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG5vdCBtYXRjaCwgcmVtb3ZlIHRoZSBjYXJkcyBmcm9tIHRoZSBsaXN0IGFuZCBoaWRlIHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGluY3JlbWVudCB0aGUgbW92ZSBjb3VudGVyIGFuZCBkaXNwbGF5IGl0IG9uIHRoZSBwYWdlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIGFsbCBjYXJkcyBoYXZlIG1hdGNoZWQsIGRpc3BsYXkgYSBtZXNzYWdlIHdpdGggdGhlIGZpbmFsIHNjb3JlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKi9cclxuIl19
