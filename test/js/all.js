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
    loseStar: function loseStar() {
        var star = this.stars.pop();
        star.remove();
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
        //Check if this is the games first start, if so assign Elements to View parameters
        if (!this.gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('restart');
            this.stars = document.getElementsByClassName('fa fa-star');

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

        setTimeout(function () {
            that.hideCards(card1, card2);
            Octo.resetActiveCard();
            that.wrongSet = false;
        }, 1200);

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

                        card.card === activeC[0].card ? View.setMatched(card, activeC[0]) : View.wrongCards(card, activeC[0]);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwibG9zZVN0YXIiLCJzdGFyIiwic3RhcnMiLCJwb3AiLCJyZW1vdmUiLCJoaWRlQ2FyZHMiLCJjbGFzc0xpc3QiLCJ3cm9uZ0NhcmRzIiwiY2FyZDEiLCJjYXJkMiIsImFkZCIsInNldE1hdGNoZWQiLCJPY3RvIiwicmVzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJyZXNldEJ1dHRvbiIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc2V0IiwiaW5uZXJIVE1MIiwid3JvbmdTZXQiLCJnZXREZWNrIiwiZSIsImVsIiwiY3VycmVudFRhcmdldCIsImNhcmRDaGVjayIsInJlc2V0TW92ZXMiLCJsb3NlTW92ZSIsImdldE1vdmVzIiwic2V0QWN0aXZlQ2FyZCIsImdldEFjdGl2ZUNhcmQiLCJzZXREZWNrIiwicmVzZXREZWNrIiwic2V0V3JvbmciLCJzZXRUaW1lb3V0IiwiYWN0aXZlQyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FB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QWUsS0FBSzRELFFBQUwsRUFBZixJQUFrQyxDQUFDL0IsS0FBS3VCLFFBQTVDLEVBQXNEO0FBQ2xELGdCQUFJekQsS0FBS00sUUFBVCxFQUFtQjtBQUNmNEIscUJBQUtPLFNBQUwsQ0FBZXpDLElBQWY7QUFDQSxxQkFBS2tFLGFBQUwsQ0FBbUIsSUFBbkI7QUFDSCxhQUhELE1BR087QUFDSCxvQkFBSU0sUUFBUTFELE1BQVIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDcEJkLHlCQUFLTSxRQUFMLEdBQWdCLElBQWhCO0FBQ0FOLHlCQUFLMEMsU0FBTCxDQUFlSSxHQUFmLENBQW1CLE1BQW5COztBQUVBLHdCQUFJMEIsUUFBUSxDQUFSLENBQUosRUFBZ0I7QUFDWiw2QkFBS04sYUFBTCxDQUFtQk0sUUFBUSxDQUFSLENBQW5CLEVBQThCeEUsSUFBOUI7O0FBRUFBLDZCQUFLQSxJQUFMLEtBQWN3RSxRQUFRLENBQVIsRUFBV3hFLElBQXpCLEdBQ0lrQyxLQUFLYSxVQUFMLENBQWdCL0MsSUFBaEIsRUFBcUJ3RSxRQUFRLENBQVIsQ0FBckIsQ0FESixHQUVNdEMsS0FBS1MsVUFBTCxDQUFnQjNDLElBQWhCLEVBQXFCd0UsUUFBUSxDQUFSLENBQXJCLENBRk47QUFHSCxxQkFORCxNQU1PO0FBQ0gsNkJBQUtOLGFBQUwsQ0FBbUJsRSxJQUFuQjtBQUNIO0FBRUo7QUFDSjtBQUNKO0FBQ0osS0F4RlE7O0FBMEZUdUQsV0FBTyxpQkFBVztBQUNkLGFBQUtRLFVBQUw7QUFDQSxhQUFLTSxTQUFMO0FBQ0FuQyxhQUFLUixJQUFMO0FBQ0gsS0E5RlE7O0FBZ0dUQSxVQUFNLGdCQUFXO0FBQ2I1QixjQUFNNEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUFuR1EsQ0FBYjs7QUFzR0FzQixLQUFLdEIsSUFBTCIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuXHJcbiAgICBnYW1lU3RhcnQ6IGZhbHNlLCAvL1VzZWQgdG8gc2VlIGlmIGdhbWUgaXMgb24gaXQncyBmaXJzdCBzdGFydCByb3VuZFxyXG5cclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgbG9zZVN0YXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXIgPSB0aGlzLnN0YXJzLnBvcCgpO1xyXG4gICAgICAgIHN0YXIucmVtb3ZlKCk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL0hpZGUgY2FyZFxyXG4gICAgaGlkZUNhcmRzOiBmdW5jdGlvbiguLi5jYXJkcykge1xyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ21hdGNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoZSB3cm9uZyBwYWlyIG9mIGNhcmRzIGFyZSBzZWxlY3RlZCwgdGhlbiBydW4gdGhpcyBmdW5jdGlvblxyXG4gICAgd3JvbmdDYXJkczogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmYSBmYS1zdGFyJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXNldCB0aGUgZGVja1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLndyb25nU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBPY3RvLmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICByZXNldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBsb3NlTW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBcclxuICAgICAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0V3Jvbmc6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC53cm9uZ1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoYXQuaGlkZUNhcmRzKGNhcmQxLGNhcmQyKTtcclxuICAgICAgICAgICAgT2N0by5yZXNldEFjdGl2ZUNhcmQoKTtcclxuICAgICAgICAgICAgdGhhdC53cm9uZ1NldCA9IGZhbHNlO1xyXG4gICAgICAgIH0sIDEyMDApO1xyXG5cclxuICAgICAgICB0aGlzLmxvc2VNb3ZlKCk7XHJcbiAgICAgICAgVmlldy5sb3NlU3RhcigpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSB0aGlzLmdldEFjdGl2ZUNhcmQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoICYmIHRoaXMuZ2V0TW92ZXMoKSAmJiAhVmlldy53cm9uZ1NldCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgVmlldy5oaWRlQ2FyZHMoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChhY3RpdmVDWzBdLGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkID09PSBhY3RpdmVDWzBdLmNhcmQgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZpZXcuc2V0TWF0Y2hlZChjYXJkLGFjdGl2ZUNbMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFZpZXcud3JvbmdDYXJkcyhjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgdGhpcy5yZXNldERlY2soKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
