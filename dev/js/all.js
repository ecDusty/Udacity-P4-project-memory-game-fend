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

    createCard: function createCard(card, n) {
        var baseCard = document.createElement('li');
        baseCard.subEl = document.createElement('i');

        //Place the name of the card with the Object element
        baseCard.card = card;

        //Has the card been matched up? This makes it easily accessable throughout the game
        baseCard.match = false;

        //Tells whether the card is showing or not
        baseCard.cardShow = false;

        //Set ID number to a card
        baseCard.cardID = n;

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

        var n = 0;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var card = _step.value;

                startDeck.push(that.createCard(card, n));
                n++;
                startDeck.push(that.createCard(card, n));
                n++;
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
    reset: function reset() {},

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

    resetMove: function resetMove() {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInJlc2V0IiwidXBkYXRlU3RhcnMiLCJoaWRlQ2FyZHMiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJ3cm9uZ0NhcmRzIiwiY2FyZDEiLCJjYXJkMiIsImFkZCIsInNldFRpbWVvdXQiLCJPY3RvIiwicmVzZXRBY3RpdmVDYXJkIiwibG9zZU1vdmUiLCJzZXRNYXRjaGVkIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsImdldEFjdGl2ZUNhcmQiLCJnZXRNb3ZlcyIsInNldEFjdGl2ZUNhcmQiLCJ0aGVEZWNrIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlubmVySFRNTCIsImdldERlY2siLCJhZGRFdmVudExpc3RlbmVyIiwiZSIsImVsIiwiY3VycmVudFRhcmdldCIsInJlc2V0TW92ZSIsInNldERlY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQTs7Ozs7OztBQVFBOztBQUVBOztBQUVBLElBQU1BLFFBQVE7O0FBRVZDLGdCQUFZLG9CQUFTQyxJQUFULEVBQWNDLENBQWQsRUFBaUI7QUFDekIsWUFBTUMsV0FBV0MsU0FBU0MsYUFB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d0IsYUFBUyxtQkFBVztBQUNoQixlQUFPN0QsTUFBTTZCLElBQWI7QUFDSCxLQW5DUTs7QUFxQ1Q7QUFDQXNDLGFBQVMsaUJBQVN0QyxJQUFULEVBQWU7QUFDcEI3QixjQUFNNkIsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0F4Q1E7O0FBMENUQyxVQUFNLGdCQUFXO0FBQ2I5QixjQUFNOEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUE3Q1EsQ0FBYjs7QUFnREFtQixLQUFLbkIsSUFBTDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCxuKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldCBJRCBudW1iZXIgdG8gYSBjYXJkXHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZElEID0gbjtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbiA9IDBcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQsbikpO1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkLG4pKTtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLiByZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB0aGF0LmhpZGVDYXJkcyhjYXJkMSxjYXJkMik7XHJcbiAgICAgICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICAgICAgfSwgMzAwMCk7XHJcbiAgICAgICAgT2N0by5sb3NlTW92ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU3RhcnMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSBPY3RvLmdldEFjdGl2ZUNhcmQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoICYmIE9jdG8uZ2V0TW92ZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlQ2FyZHMoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXJkLmNhcmQgPT09IGFjdGl2ZUNbMF0uY2FyZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgcmVzZXRNb3ZlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBsb3NlTW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIGN1cnJlbnQgZGVja1xyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuLypcclxuICogc2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lciBmb3IgYSBjYXJkLiBJZiBhIGNhcmQgaXMgY2xpY2tlZDpcclxuICogIC0gZGlzcGxheSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gYWRkIHRoZSBjYXJkIHRvIGEgKmxpc3QqIG9mIFwib3BlblwiIGNhcmRzIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBpZiB0aGUgbGlzdCBhbHJlYWR5IGhhcyBhbm90aGVyIGNhcmQsIGNoZWNrIHRvIHNlZSBpZiB0aGUgdHdvIGNhcmRzIG1hdGNoXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG1hdGNoLCBsb2NrIHRoZSBjYXJkcyBpbiB0aGUgb3BlbiBwb3NpdGlvbiAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbm90IG1hdGNoLCByZW1vdmUgdGhlIGNhcmRzIGZyb20gdGhlIGxpc3QgYW5kIGhpZGUgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaW5jcmVtZW50IHRoZSBtb3ZlIGNvdW50ZXIgYW5kIGRpc3BsYXkgaXQgb24gdGhlIHBhZ2UgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgYWxsIGNhcmRzIGhhdmUgbWF0Y2hlZCwgZGlzcGxheSBhIG1lc3NhZ2Ugd2l0aCB0aGUgZmluYWwgc2NvcmUgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqL1xyXG4iXX0=
