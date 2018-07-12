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
        card1.classList.add('wrong');
        card1.cardShow = false;
        card2.classList.add('wrong');
        card2.cardShow = false;
        setTimeout(this.hideCards(card1, card2), 1400);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwiaGlkZUNhcmRzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJhZGQiLCJzZXRUaW1lb3V0IiwiT2N0byIsImxvc2VNb3ZlIiwic2V0TWF0Y2hlZCIsInJlc2V0QWN0aXZlQ2FyZCIsImNhcmRDaGVjayIsImFjdGl2ZUMiLCJnZXRBY3RpdmVDYXJkIiwiZ2V0TW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJnZXREZWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbCIsImN1cnJlbnRUYXJnZXQiLCJzZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFRQTs7QUFFQTs7QUFFQSxJQUFNQSxRQUFROztBQUVWQyxnQkFBWSxvQkFBU0MsSUFBVCxFQUFjQyxDQUFkLEVBQWlCO0FBQ3pCLFlBQU1DLFdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBakI7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QUFhQSxJQUFiO0FBQ0gsS0FwQ1E7O0FBc0NUQyxVQUFNLGdCQUFXO0FBQ2I5QixjQUFNOEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUF6Q1EsQ0FBYjs7QUE0Q0FrQixLQUFLbEIsSUFBTDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCxuKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldCBJRCBudW1iZXIgdG8gYSBjYXJkXHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZElEID0gbjtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbiA9IDBcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQsbikpO1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkLG4pKTtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSAzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLiByZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8vSGlkZSBjYXJkXHJcbiAgICBoaWRlQ2FyZHM6IGZ1bmN0aW9uKC4uLmNhcmRzKSB7XHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBjYXJkcykge1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3dyb25nJyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnbWF0Y2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDEuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQyLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgc2V0VGltZW91dCh0aGlzLmhpZGVDYXJkcyhjYXJkMSxjYXJkMiksIDE0MDApO1xyXG4gICAgICAgIE9jdG8ubG9zZU1vdmUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gT2N0by5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCAmJiBPY3RvLmdldE1vdmVzKCkpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUNhcmRzKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChhY3RpdmVDWzBdLGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5jYXJkID09PSBhY3RpdmVDWzBdLmNhcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0Y2hlZChjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cm9uZ0NhcmRzKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50aGVEZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVjaycpWzBdO1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2suYXBwZW5kQ2hpbGQoY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBPY3RvID0ge1xyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBsb3NlTW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgLy9TZXQgdGhlIGN1cnJlbnQgZGVja1xyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuLypcclxuICogc2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lciBmb3IgYSBjYXJkLiBJZiBhIGNhcmQgaXMgY2xpY2tlZDpcclxuICogIC0gZGlzcGxheSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gYWRkIHRoZSBjYXJkIHRvIGEgKmxpc3QqIG9mIFwib3BlblwiIGNhcmRzIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBpZiB0aGUgbGlzdCBhbHJlYWR5IGhhcyBhbm90aGVyIGNhcmQsIGNoZWNrIHRvIHNlZSBpZiB0aGUgdHdvIGNhcmRzIG1hdGNoXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG1hdGNoLCBsb2NrIHRoZSBjYXJkcyBpbiB0aGUgb3BlbiBwb3NpdGlvbiAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbm90IG1hdGNoLCByZW1vdmUgdGhlIGNhcmRzIGZyb20gdGhlIGxpc3QgYW5kIGhpZGUgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaW5jcmVtZW50IHRoZSBtb3ZlIGNvdW50ZXIgYW5kIGRpc3BsYXkgaXQgb24gdGhlIHBhZ2UgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgYWxsIGNhcmRzIGhhdmUgbWF0Y2hlZCwgZGlzcGxheSBhIG1lc3NhZ2Ugd2l0aCB0aGUgZmluYWwgc2NvcmUgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqL1xyXG4iXX0=
