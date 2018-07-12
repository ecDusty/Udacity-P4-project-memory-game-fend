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

    reset: function reset() {
        Octo.resetMoves();
        Octo.resetDeck();
        this.init();
    },

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
        this.loseStar();
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

        //Check if this is the games first start, if so assign Elements to View parameters
        if (!this.gameStart) {
            this.theDeck = document.getElementsByClassName('deck')[0];
            this.resetButton = document.getElementById('restart');
            this.stars = document.getElementsByClassName('fa fa-star');

            this.resetButton.addEventListener('click', function () {
                that.reset();
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

    init: function init() {
        Model.init();
        View.init();
    }
};

Octo.init();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImFjdGl2ZUNhcmQiLCJWaWV3IiwiZ2FtZVN0YXJ0IiwicmVzZXQiLCJPY3RvIiwicmVzZXRNb3ZlcyIsInJlc2V0RGVjayIsImxvc2VTdGFyIiwic3RhciIsInN0YXJzIiwicG9wIiwicmVtb3ZlIiwiaGlkZUNhcmRzIiwiY2xhc3NMaXN0Iiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJ3cm9uZ1NldCIsImFkZCIsInNldFRpbWVvdXQiLCJyZXNldEFjdGl2ZUNhcmQiLCJsb3NlTW92ZSIsInNldE1hdGNoZWQiLCJjYXJkQ2hlY2siLCJhY3RpdmVDIiwiZ2V0QWN0aXZlQ2FyZCIsImdldE1vdmVzIiwic2V0QWN0aXZlQ2FyZCIsInRoZURlY2siLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwicmVzZXRCdXR0b24iLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbm5lckhUTUwiLCJnZXREZWNrIiwiZSIsImVsIiwiY3VycmVudFRhcmdldCIsInNldERlY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQTs7Ozs7OztBQVFBOztBQUVBOztBQUVBLElBQU1BLFFB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QU87O0FBRVRDLGdCQUFZLHNCQUFXO0FBQ25CeEMsY0FBTWdDLEtBQU4sR0FBYyxDQUFkO0FBQ0gsS0FKUTs7QUFNVDtBQUNBd0IsY0FBVSxvQkFBVztBQUNqQnhELGNBQU1nQyxLQUFOO0FBQ0gsS0FUUTs7QUFXVDtBQUNBNkIsY0FBVSxvQkFBVztBQUNqQixlQUFPN0QsTUFBTWdDLEtBQWI7QUFDSCxLQWRROztBQWdCVDtBQUNBdUIscUJBQWlCLDJCQUFXO0FBQ3hCdkQsY0FBTW1DLFVBQU4sR0FBbUIsRUFBbkI7QUFDSCxLQW5CUTs7QUFxQlQ7QUFDQTJCLG1CQUFlLHVCQUFTWixLQUFULEVBQWVDLEtBQWYsRUFBc0I7QUFDakNBLGdCQUNJbkQsTUFBTW1DLFVBQU4sR0FBbUIsQ0FBQ2UsS0FBRCxFQUFPQyxLQUFQLENBRHZCLEdBRU1uRCxNQUFNbUMsVUFBTixHQUFtQixDQUFDZSxLQUFELENBRnpCO0FBR0gsS0ExQlE7O0FBNEJUO0FBQ0FVLG1CQUFlLHlCQUFXO0FBQ3RCLGVBQU81RCxNQUFNbUMsVUFBYjtBQUNILEtBL0JROztBQWlDVDtBQUNBa0MsYUFBUyxtQkFBVztBQUNoQixlQUFPckUsTUFBTTJCLElBQWI7QUFDSCxLQXBDUTs7QUFzQ1Q7QUFDQThDLGFBQVMsaUJBQVM5QyxJQUFULEVBQWU7QUFDcEIzQixjQUFNMkIsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0F6Q1E7O0FBMkNUYyxlQUFXLHFCQUFXO0FBQ2xCekMsY0FBTXNCLFNBQU47QUFDSCxLQTdDUTs7QUErQ1RNLFVBQU0sZ0JBQVc7QUFDYjVCLGNBQU00QixJQUFOO0FBQ0FRLGFBQUtSLElBQUw7QUFDSDtBQWxEUSxDQUFiOztBQXFEQVcsS0FBS1gsSUFBTCIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gMztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gMDtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuXHJcbiAgICBnYW1lU3RhcnQ6IGZhbHNlLCAvL1VzZWQgdG8gc2VlIGlmIGdhbWUgaXMgb24gaXQncyBmaXJzdCBzdGFydCByb3VuZFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBPY3RvLnJlc2V0TW92ZXMoKTtcclxuICAgICAgICBPY3RvLnJlc2V0RGVjaygpO1xyXG4gICAgICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0luaXRpYWxpemF0aW9uIG9mIHRoZSBnYW1lIHZpZXcsIHBsYWNlcyBlbGVtZW50cyBpbiB0aGUgRE9NICYgYWRkaW5nIGV2ZW50IGxpc3RlbmVycy5cclxuICAgIGxvc2VTdGFyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBzdGFyID0gdGhpcy5zdGFycy5wb3AoKTtcclxuICAgICAgICBzdGFyLnJlbW92ZSgpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLy9IaWRlIGNhcmRcclxuICAgIGhpZGVDYXJkczogZnVuY3Rpb24oLi4uY2FyZHMpIHtcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnd3JvbmcnKTtcclxuICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdtYXRjaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhhdC53cm9uZ1NldCA9IHRydWU7XHJcblxyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdGhhdC5oaWRlQ2FyZHMoY2FyZDEsY2FyZDIpO1xyXG4gICAgICAgICAgICBPY3RvLnJlc2V0QWN0aXZlQ2FyZCgpO1xyXG4gICAgICAgICAgICB0aGF0Lndyb25nU2V0ID0gZmFsc2U7XHJcbiAgICAgICAgfSwgMzAwMCk7XHJcblxyXG4gICAgICAgIE9jdG8ubG9zZU1vdmUoKTtcclxuICAgICAgICB0aGlzLmxvc2VTdGFyKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIE9jdG8ucmVzZXRBY3RpdmVDYXJkKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gT2N0by5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCAmJiBPY3RvLmdldE1vdmVzKCkgJiYgIXRoaXMud3JvbmdTZXQpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUNhcmRzKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZCA9PT0gYWN0aXZlQ1swXS5jYXJkID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBpcyB0aGUgZ2FtZXMgZmlyc3Qgc3RhcnQsIGlmIHNvIGFzc2lnbiBFbGVtZW50cyB0byBWaWV3IHBhcmFtZXRlcnNcclxuICAgICAgICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXJ0Jyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdmYSBmYS1zdGFyJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnJlc2V0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXNldCB0aGUgZGVja1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLndyb25nU2V0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICByZXNldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5tb3ZlcyA9IDM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vUmV0dXJuIG1vdmVzXHJcbiAgICBsb3NlTW92ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwubW92ZXMtLTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9SZXR1cm4gbW92ZXNcclxuICAgIGdldE1vdmVzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwubW92ZXM7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vcmVzZXQgZmxpcHBlZCBjYXJkcyBhcnJheVxyXG4gICAgcmVzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5hY3RpdmVDYXJkID0gW107XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IGZsaXBwZWQgY2FyZHNcclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBcclxuICAgICAgICAgICAgTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vU2V0IHRoZSBjdXJyZW50IGRlY2tcclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgcmVzZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5idWlsZERlY2soKTtcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbiJdfQ==
