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

    gameStart: false,

    reset: function reset() {
        Octo.resetMoves();
        Octo.resetDeck();
        this.init();
    },

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
        var that = this;
        that.wrongSet = true;

        card1.classList.add('wrong');
        card2.classList.add('wrong');

        setTimeout(function () {
            that.hideCards(card1, card2);
            Octo.resetActiveCard();
            that.wrongSet = false;
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

        if (!card.match && Octo.getMoves() && !this.wrongSet) {
            if (card.cardShow) {
                this.hideCards(card);
                Octo.setActiveCard(null);
            } else {
                if (activeC.length < 2) {
                    card.cardShow = true;
                    card.classList.add('show');

                    if (activeC[0]) {
                        Octo.setActiveCard(activeC[0], card);

                        card.card === activeC[0].card ? this.setMatched(card, activeC[0]) : this.wrongCards(card, activeC[0]);
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
        this.wrongSet = false;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwicmVzZXQiLCJPY3RvIiwicmVzZXRNb3ZlcyIsInJlc2V0RGVjayIsImxvc2VTdGFyIiwiaGlkZUNhcmRzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJ3cm9uZ1NldCIsImFkZCIsInNldFRpbWVvdXQiLCJyZXNldEFjdGl2ZUNhcmQiLCJsb3NlTW92ZSIsInVwZGF0ZVN0YXJzIiwic2V0TWF0Y2hlZCIsImNhcmRDaGVjayIsImFjdGl2ZUMiLCJnZXRBY3RpdmVDYXJkIiwiZ2V0TW92ZXMiLCJzZXRBY3RpdmVDYXJkIiwidGhlRGVjayIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckhUTUwiLCJnZXREZWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbCIsImN1cnJlbnRUYXJnZXQiLCJzZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFRQTs7QUFFQTs7QUFFQSxJQUFNQSxRQUFROztBQUVWQyxnQkFBWSxvQkFBU0MsSUFBVCxFQUFlO0FBQ3ZC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S0FBRCxDQUZ6QjtBQUdILEtBMUJROztBQTRCVDtBQUNBVyxtQkFBZSx5QkFBVztBQUN0QixlQUFPMUQsTUFBTW1DLFVBQWI7QUFDSCxLQS9CUTs7QUFpQ1Q7QUFDQTZCLGFBQVMsbUJBQVc7QUFDaEIsZUFBT2hFLE1BQU0yQixJQUFiO0FBQ0gsS0FwQ1E7O0FBc0NUO0FBQ0EwQyxhQUFTLGlCQUFTMUMsSUFBVCxFQUFlO0FBQ3BCM0IsY0FBTTJCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBekNROztBQTJDVGMsZUFBVyxxQkFBVztBQUNsQnpDLGNBQU1zQixTQUFOO0FBQ0gsS0E3Q1E7O0FBK0NUTSxVQUFNLGdCQUFXO0FBQ2I1QixjQUFNNEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUFsRFEsQ0FBYjs7QUFxREFXLEtBQUtYLElBQUwiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG5cclxuLy8gTVkgQVRURU1QVCB0byBidWlsZCB0aGlzIGluIGEgTU9WIGZvcm1hdFxyXG5cclxuLy8gVGhlIG1vZGVsIGhvbGRzIGFsbCB0aGUgZ2FtZXMgZGF0YS5cclxuXHJcbmNvbnN0IE1vZGVsID0ge1xyXG5cclxuICAgIGNyZWF0ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgLy9IYXMgdGhlIGNhcmQgYmVlbiBtYXRjaGVkIHVwPyBUaGlzIG1ha2VzIGl0IGVhc2lseSBhY2Nlc3NhYmxlIHRocm91Z2hvdXQgdGhlIGdhbWVcclxuICAgICAgICBiYXNlQ2FyZC5tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGVsbHMgd2hldGhlciB0aGUgY2FyZCBpcyBzaG93aW5nIG9yIG5vdFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNhcmQgRE9NIHN0cnVjdHVyZSBhbmQgYXR0cmlidXRlcy5cclxuICAgICAgICBiYXNlQ2FyZC5jbGFzc05hbWUgPSAnY2FyZCc7XHJcbiAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbC5jbGFzc05hbWUgPSAnZmEgZmEtJyArIGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgICAgICAvLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlY2sgPSB0aGlzLnNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vSWYgYSBicm93c2VyIGhhcyBsb2NhbCBnYW1lIHN0b3JhZ2UsIHRoYW4gbG9hZCB0aGF0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgZ2FtZS5cclxuICAgICAgICAvLyBMT0NBTCBTVE9SR0FFIEFCSUxJVFkgSEFTTlwiVCBCRUVOIEJVSUxUIFlFVC5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBnYW1lLmFjdGl2ZUNhcmRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IDM7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IFtudWxsXTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZERlY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFZpZXcgPSB7XHJcblxyXG4gICAgZ2FtZVN0YXJ0OiBmYWxzZSxcclxuXHJcbiAgICByZXNldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgT2N0by5yZXNldE1vdmVzKCk7XHJcbiAgICAgICAgT2N0by5yZXNldERlY2soKTtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICBsb3NlU3RhcjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy9IaWRlIGNhcmRcclxuICAgIGhpZGVDYXJkczogZnVuY3Rpb24oLi4uY2FyZHMpIHtcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnd3JvbmcnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdtYXRjaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC53cm9uZ1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhhdC5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICB0aGF0Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMzAwMCk7XHJcblxyXG4gICAgICAgIE9jdG8ubG9zZU1vdmUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVN0YXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gT2N0by5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCAmJiBPY3RvLmdldE1vdmVzKCkgJiYgIXRoaXMud3JvbmdTZXQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUNhcmRzKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZCA9PT0gYWN0aXZlQ1swXS5jYXJkID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50aGVEZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVjaycpWzBdO1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLndyb25nU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgcmVzZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMgPSAzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1JldHVybiBtb3Zlc1xyXG4gICAgbG9zZU1vdmU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLm1vdmVzLS07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBnZXRNb3ZlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLm1vdmVzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL3Jlc2V0IGZsaXBwZWQgY2FyZHMgYXJyYXlcclxuICAgIHJlc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCBmbGlwcGVkIGNhcmRzXHJcbiAgICBzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQyID8gXHJcbiAgICAgICAgICAgIE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDEsY2FyZDJdXHJcbiAgICAgICAgICAgIDogTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IGN1cnJlbnQgZmxpcHBlZCBjYXJkXHJcbiAgICBnZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuYWN0aXZlQ2FyZDtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1NldCB0aGUgY3VycmVudCBkZWNrXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuYnVpbGREZWNrKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmluaXQoKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG4iXX0=
