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
        var that = this;
        card1.classList.add('wrong');
        card1.cardShow = false;
        card2.classList.add('wrong');
        card2.cardShow = false;
        setTimeout(function () {
            that.hideCards(card1, card2);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwiaGlkZUNhcmRzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJhZGQiLCJzZXRUaW1lb3V0IiwiT2N0byIsImxvc2VNb3ZlIiwic2V0TWF0Y2hlZCIsInJlc2V0QWN0aXZlQ2FyZCIsImNhcmRDaGVjayIsImFjdGl2ZUMiLCJnZXRBY3RpdmVDYXJkIiwiZ2V0TW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJnZXREZWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbCIsImN1cnJlbnRUYXJnZXQiLCJzZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFRQTs7QUFFQTs7QUFFQSxJQUFNQSxRQUFROztBQUVWQyxnQkFBWSxvQkFBU0MsSUFBVCxFQUFjQyxDQUFkLEVBQWlCO0FBQ3pCLFlBQU1DLFdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBakI7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LGlCQUFTcEMsSUFBVCxFQUFlO0FBQ3BCN0IsY0FBTTZCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBcENROztBQXNDVEMsVUFBTSxnQkFBVztBQUNiOUIsY0FBTThCLElBQU47QUFDQVEsYUFBS1IsSUFBTDtBQUNIO0FBekNRLENBQWI7O0FBNENBa0IsS0FBS2xCLElBQUw7O0FBRUEiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG5cclxuLy8gTVkgQVRURU1QVCB0byBidWlsZCB0aGlzIGluIGEgTU9WIGZvcm1hdFxyXG5cclxuLy8gVGhlIG1vZGVsIGhvbGRzIGFsbCB0aGUgZ2FtZXMgZGF0YS5cclxuXHJcbmNvbnN0IE1vZGVsID0ge1xyXG5cclxuICAgIGNyZWF0ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQsbikge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXQgSUQgbnVtYmVyIHRvIGEgY2FyZFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRJRCA9IG47XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNhcmQgRE9NIHN0cnVjdHVyZSBhbmQgYXR0cmlidXRlcy5cclxuICAgICAgICBiYXNlQ2FyZC5jbGFzc05hbWUgPSAnY2FyZCc7XHJcbiAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbC5jbGFzc05hbWUgPSAnZmEgZmEtJyArIGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgICAgICAvLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IG4gPSAwXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkLG4pKTtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCxuKSk7XHJcbiAgICAgICAgICAgIG4rKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy4gcmVjb3JkVGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IFtudWxsXTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZERlY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFZpZXcgPSB7XHJcbiAgICAvL0luaXRpYWxpemF0aW9uIG9mIHRoZSBnYW1lIHZpZXcsIHBsYWNlcyBlbGVtZW50cyBpbiB0aGUgRE9NICYgYWRkaW5nIGV2ZW50IGxpc3RlbmVycy5cclxuICAgIHVwZGF0ZVN0YXJzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICAvL0hpZGUgY2FyZFxyXG4gICAgaGlkZUNhcmRzOiBmdW5jdGlvbiguLi5jYXJkcykge1xyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCd3cm9uZycpO1xyXG4gICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ21hdGNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoZSB3cm9uZyBwYWlyIG9mIGNhcmRzIGFyZSBzZWxlY3RlZCwgdGhlbiBydW4gdGhpcyBmdW5jdGlvblxyXG4gICAgd3JvbmdDYXJkczogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQxLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBjYXJkMi5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoYXQuaGlkZUNhcmRzKGNhcmQxLGNhcmQyKTtcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgICAgICBPY3RvLmxvc2VNb3ZlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdGFycygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRNYXRjaGVkOiBmdW5jdGlvbihjYXJkMSwgY2FyZDIpIHtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQxLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCdtYXRjaCcpO1xyXG4gICAgICAgIGNhcmQyLm1hdGNoID0gdHJ1ZTtcclxuICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0NoZWNrIHdoYXQgdGhlIGNhcmQgLyBjYXJkcyBhcmUgc2V0IGFzLCBhbmQgYWN0IGFjY29yZGluZ2x5LlxyXG4gICAgY2FyZENoZWNrOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQyA9IE9jdG8uZ2V0QWN0aXZlQ2FyZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWNhcmQubWF0Y2ggJiYgT2N0by5nZXRNb3ZlcygpKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmNhcmRTaG93KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVDYXJkcyhjYXJkKTtcclxuICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQuY2FyZCA9PT0gYWN0aXZlQ1swXS5jYXJkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JvbmdDYXJkcyhjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICB0aGlzLnRoZURlY2suaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICAvL1JldHVybiBtb3Zlc1xyXG4gICAgbG9zZU1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzLS07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL3Jlc2V0IGZsaXBwZWQgY2FyZHMgYXJyYXlcclxuICAgIHJlc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCBmbGlwcGVkIGNhcmRzXHJcbiAgICBzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQyID8gTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbi8qXHJcbiAqIHNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIGEgY2FyZC4gSWYgYSBjYXJkIGlzIGNsaWNrZWQ6XHJcbiAqICAtIGRpc3BsYXkgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGFkZCB0aGUgY2FyZCB0byBhICpsaXN0KiBvZiBcIm9wZW5cIiBjYXJkcyAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gaWYgdGhlIGxpc3QgYWxyZWFkeSBoYXMgYW5vdGhlciBjYXJkLCBjaGVjayB0byBzZWUgaWYgdGhlIHR3byBjYXJkcyBtYXRjaFxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBtYXRjaCwgbG9jayB0aGUgY2FyZHMgaW4gdGhlIG9wZW4gcG9zaXRpb24gKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG5vdCBtYXRjaCwgcmVtb3ZlIHRoZSBjYXJkcyBmcm9tIHRoZSBsaXN0IGFuZCBoaWRlIHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGluY3JlbWVudCB0aGUgbW92ZSBjb3VudGVyIGFuZCBkaXNwbGF5IGl0IG9uIHRoZSBwYWdlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIGFsbCBjYXJkcyBoYXZlIG1hdGNoZWQsIGRpc3BsYXkgYSBtZXNzYWdlIHdpdGggdGhlIGZpbmFsIHNjb3JlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKi9cclxuIl19
