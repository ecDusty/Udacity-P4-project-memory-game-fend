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

    gameStart: false, //Used to see if game is on it's first start round

    //Initialization of the game view, places elements in the DOM & adding event listeners.
    loseStar: function loseStar() {},

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

        document.getElementsByClassName[0].innerHTML = '';

        for (var i = 0; i < Octo.getMoves(); i++) {
            var lItem = document.createElement('li');
            var icon = document.createElement('i');
            icon.className = 'fa fa-star';
            lItem.appendChild(icon);
            this.stars.push(lItem);
        }

        //Set Moves number
        document.getElementsByClassName('moves')[0].innerHTML = Octo.getMoves();
        this.gameStart = true;
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

    //Update Star & move number
    updateMoves: function updateMoves() {},

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
        var that = this;
        that.wrongSet = true;
        View.wrongCards(card1, card2);

        setTimeout(function () {
            that.hideCards(card1, card2);
            Octo.resetActiveCard();
            that.wrongSet = false;
        }, 1000);

        this.loseMove();
        View.loseStar();
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = this.getActiveCard();

        if (!card.match && this.getMoves() && !View.wrongSet) {
            if (card.cardShow) {
                View.hideCards(card);
                this.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');

                    if (activeC[0]) {
                        this.setActiveCard(activeC[0], card);

                        card.card === activeC[0].card ? View.setMatched(card, activeC[0]) : View.setWrong(card, activeC[0]);
                    } else {
                        this.setActiveCard(card);
                    }
                }
            }
        }
    },

    reset: function reset() {
        this.resetMoves();
        this.resetDeck();
        View.init();
    },

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwibG9zZVN0YXIiLCJoaWRlQ2FyZHMiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJ3cm9uZ0NhcmRzIiwiY2FyZDEiLCJjYXJkMiIsImFkZCIsInNldE1hdGNoZWQiLCJPY3RvIiwicmVzZXRBY3RpdmVDYXJkIiwic3RhcnMiLCJ0aGVEZWNrIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInJlc2V0QnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVzZXQiLCJpbm5lckhUTUwiLCJ3cm9uZ1NldCIsImdldERlY2siLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0IiwiY2FyZENoZWNrIiwiaSIsImdldE1vdmVzIiwibEl0ZW0iLCJpY29uIiwicmVzZXRNb3ZlcyIsImxvc2VNb3ZlIiwidXBkYXRlTW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwiZ2V0QWN0aXZlQ2FyZCIsInNldERlY2siLCJyZXNldERlY2siLCJzZXRXcm9uZyIsInNldFRpbWVvdXQiLCJhY3RpdmVDIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7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QUtzQyxRQUFMLENBQWN4RSxJQUFkLEVBQW1CMEUsUUFBUSxDQUFSLENBQW5CLENBRk47QUFHSCxxQkFORCxNQU1PO0FBQ0gsNkJBQUtOLGFBQUwsQ0FBbUJwRSxJQUFuQjtBQUNIO0FBRUo7QUFDSjtBQUNKO0FBQ0osS0E5RlE7O0FBZ0dUcUQsV0FBTyxpQkFBVztBQUNkLGFBQUtZLFVBQUw7QUFDQSxhQUFLTSxTQUFMO0FBQ0FyQyxhQUFLUixJQUFMO0FBQ0gsS0FwR1E7O0FBc0dUQSxVQUFNLGdCQUFXO0FBQ2I1QixjQUFNNEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUF6R1EsQ0FBYjs7QUE0R0FtQixLQUFLbkIsSUFBTCIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuXHJcbiAgICBnYW1lU3RhcnQ6IGZhbHNlLCAvL1VzZWQgdG8gc2VlIGlmIGdhbWUgaXMgb24gaXQncyBmaXJzdCBzdGFydCByb3VuZFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgbG9zZVN0YXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy9IaWRlIGNhcmRcclxuICAgIGhpZGVDYXJkczogZnVuY3Rpb24oLi4uY2FyZHMpIHtcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnd3JvbmcnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdtYXRjaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRjaGVkOiBmdW5jdGlvbihjYXJkMSwgY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQxLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQyLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0YXJzID0gW107XHJcbiAgICAgICAgLy9DaGVjayBpZiB0aGlzIGlzIHRoZSBnYW1lcyBmaXJzdCBzdGFydCwgaWYgc28gYXNzaWduIEVsZW1lbnRzIHRvIFZpZXcgcGFyYW1ldGVyc1xyXG4gICAgICAgIGlmICghdGhpcy5nYW1lU3RhcnQpIHtcclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVjaycpWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhcnQnKTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgT2N0by5yZXNldCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vUmVzZXQgdGhlIGRlY2tcclxuICAgICAgICB0aGlzLnRoZURlY2suaW5uZXJIVE1MID0gYGA7XHJcbiAgICAgICAgdGhpcy53cm9uZ1NldCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgT2N0by5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcblxyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2suYXBwZW5kQ2hpbGQoY2FyZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NyZWF0ZSBTdGFyc1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWVbMF0uaW5uZXJIVE1MID0gYGA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT2N0by5nZXRNb3ZlcygpOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG4gICAgICAgICAgICBpY29uLmNsYXNzTmFtZSA9IGBmYSBmYS1zdGFyYDtcclxuICAgICAgICAgICAgbEl0ZW0uYXBwZW5kQ2hpbGQoaWNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnMucHVzaChsSXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1NldCBNb3ZlcyBudW1iZXJcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb3ZlcycpWzBdLmlubmVySFRNTCA9IE9jdG8uZ2V0TW92ZXMoKTtcclxuICAgICAgICB0aGlzLmdhbWVTdGFydCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgcmVzZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMgPSAzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBtb3Zlc1xyXG4gICAgbG9zZU1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzLS07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1VwZGF0ZSBTdGFyICYgbW92ZSBudW1iZXJcclxuICAgIHVwZGF0ZU1vdmVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBcclxuICAgICAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0V3Jvbmc6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC53cm9uZ1NldCA9IHRydWU7XHJcbiAgICAgICAgVmlldy53cm9uZ0NhcmRzKGNhcmQxLGNhcmQyKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhhdC5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICB0aGF0Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMTAwMCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9zZU1vdmUoKTtcclxuICAgICAgICBWaWV3Lmxvc2VTdGFyKCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL0NoZWNrIHdoYXQgdGhlIGNhcmQgLyBjYXJkcyBhcmUgc2V0IGFzLCBhbmQgYWN0IGFjY29yZGluZ2x5LlxyXG4gICAgY2FyZENoZWNrOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQyA9IHRoaXMuZ2V0QWN0aXZlQ2FyZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWNhcmQubWF0Y2ggJiYgdGhpcy5nZXRNb3ZlcygpICYmICFWaWV3Lndyb25nU2V0KSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmNhcmRTaG93KSB7XHJcbiAgICAgICAgICAgICAgICBWaWV3LmhpZGVDYXJkcyhjYXJkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmQgPT09IGFjdGl2ZUNbMF0uY2FyZCA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmlldy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogVmlldy5zZXRXcm9uZyhjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldERlY2soKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
