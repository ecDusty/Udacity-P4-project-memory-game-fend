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
            this.activeCard = [null];
            this.buildDeck();
        }
    }
};

var View = {
    //Initialization of the game view, places elements in the DOM & adding event listeners.
    updateStars: function updateStars() {},

    //The wrong pair of cards are selected, then run this function
    wrongCards: function wrongCards(card1, card2) {
        card1.classList.add('wrong');
        card1.cardShow = false;
        card2.classList.add('wrong');
        card2.cardShow = false;
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.match = true;
        card2.classList.add('match');
        card2.match = true;
    },

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        var activeC = Octo.getActiveCard();

        if (!card.match) {
            if (card.cardShow) {
                card.cardShow = false;
                card.classList.remove('show');
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Octo.getDeck()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var card = _step2.value;

                card.addEventListener('click', function (e) {
                    var el = e.currentTarget;
                    that.cardCheck(el);
                });
                this.theDeck.appendChild(card);
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
    }
};

var Octo = {

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRNYXRjaGVkIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsIk9jdG8iLCJnZXRBY3RpdmVDYXJkIiwicmVtb3ZlIiwic2V0QWN0aXZlQ2FyZCIsInRoZURlY2siLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiZ2V0RGVjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0Iiwic2V0RGVjayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBY0MsQ0FBZCxFQUFpQjtBQUN6QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztBQUVBO0FBQ0FG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QUFPdkQsTUFBTTZCLElBQWI7QUFDSCxLQWZROztBQWlCVCtCLGFBQVMsaUJBQVMvQixJQUFULEVBQWU7QUFDcEI3QixjQUFNNkIsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0FuQlE7O0FBcUJUQyxVQUFNLGdCQUFXO0FBQ2I5QixjQUFNOEIsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0g7QUF4QlEsQ0FBYjs7QUEyQkFrQixLQUFLbEIsSUFBTDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCxuKSB7XHJcbiAgICAgICAgY29uc3QgYmFzZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cclxuICAgICAgICAvL1BsYWNlIHRoZSBuYW1lIG9mIHRoZSBjYXJkIHdpdGggdGhlIE9iamVjdCBlbGVtZW50XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZCA9IGNhcmQ7XHJcblxyXG4gICAgICAgIC8vSGFzIHRoZSBjYXJkIGJlZW4gbWF0Y2hlZCB1cD8gVGhpcyBtYWtlcyBpdCBlYXNpbHkgYWNjZXNzYWJsZSB0aHJvdWdob3V0IHRoZSBnYW1lXHJcbiAgICAgICAgYmFzZUNhcmQubWF0Y2ggPSBmYWxzZTtcclxuICAgICAgICBcclxuICAgICAgICAvL1RlbGxzIHdoZXRoZXIgdGhlIGNhcmQgaXMgc2hvd2luZyBvciBub3RcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL1NldCBJRCBudW1iZXIgdG8gYSBjYXJkXHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZElEID0gbjtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBsZXQgbiA9IDBcclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQsbikpO1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkLG4pKTtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kZWNrID0gdGhpcy5zaHVmZmxlKHN0YXJ0RGVjayk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhpcyBydW5zIG9uIGdhbWUgc3RhcnQuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvL0lmIGEgYnJvd3NlciBoYXMgbG9jYWwgZ2FtZSBzdG9yYWdlLCB0aGFuIGxvYWQgdGhhdCBpbnN0ZWFkIG9mIGNyZWF0aW5nIGEgbmV3IGdhbWUuXHJcbiAgICAgICAgLy8gTE9DQUwgU1RPUkdBRSBBQklMSVRZIEhBU05cIlQgQkVFTiBCVUlMVCBZRVQuXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJykpIHtcclxuICAgICAgICAgICAgY29uc3QgZ2FtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdlY21NZW1HYW1lJyk7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZXMgPSBnYW1lLm1vdmVzO1xyXG4gICAgICAgICAgICB0aGlzLnRpbWUgPSBnYW1lLnRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVjb3JkVGltZSA9IGdhbWUucmVjb3JkVGltZTtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IGdhbWUuY2FyZHM7XHJcbiAgICAgICAgICAgIHRoaXMuZGVjayA9IGdhbWUuZGVjaztcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gZ2FtZS5hY3RpdmVDYXJkXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IFtudWxsXTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZERlY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFZpZXcgPSB7XHJcbiAgICAvL0luaXRpYWxpemF0aW9uIG9mIHRoZSBnYW1lIHZpZXcsIHBsYWNlcyBlbGVtZW50cyBpbiB0aGUgRE9NICYgYWRkaW5nIGV2ZW50IGxpc3RlbmVycy5cclxuICAgIHVwZGF0ZVN0YXJzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8vVGhlIHdyb25nIHBhaXIgb2YgY2FyZHMgYXJlIHNlbGVjdGVkLCB0aGVuIHJ1biB0aGlzIGZ1bmN0aW9uXHJcbiAgICB3cm9uZ0NhcmRzOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDEuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQyLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1hdGNoZWQ6IGZ1bmN0aW9uKGNhcmQxLCBjYXJkMikge1xyXG4gICAgICAgIGNhcmQxLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIubWF0Y2ggPSB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0NoZWNrIHdoYXQgdGhlIGNhcmQgLyBjYXJkcyBhcmUgc2V0IGFzLCBhbmQgYWN0IGFjY29yZGluZ2x5LlxyXG4gICAgY2FyZENoZWNrOiBmdW5jdGlvbihjYXJkKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQyA9IE9jdG8uZ2V0QWN0aXZlQ2FyZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWNhcmQubWF0Y2gpIHtcclxuICAgICAgICAgICAgaWYgKGNhcmQuY2FyZFNob3cpIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUMubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChhY3RpdmVDWzBdLGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FyZC5jYXJkID09PSBhY3RpdmVDWzBdLmNhcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TWF0Y2hlZChjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53cm9uZ0NhcmRzKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50aGVEZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVjaycpWzBdO1xyXG4gICAgICAgIHRoaXMudGhlRGVjay5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiBPY3RvLmdldERlY2soKSl7XHJcbiAgICAgICAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbCA9IGUuY3VycmVudFRhcmdldDtcclxuICAgICAgICAgICAgICAgIHRoYXQuY2FyZENoZWNrKGVsKTtcclxuICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2suYXBwZW5kQ2hpbGQoY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBPY3RvID0ge1xyXG5cclxuICAgIHNldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDIgPyBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxLGNhcmQyXVxyXG4gICAgICAgICAgICA6IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDFdO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCBjdXJyZW50IGZsaXBwZWQgY2FyZFxyXG4gICAgZ2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmFjdGl2ZUNhcmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IHRoZSBjdXJyZW50IGFycmF5IG9mIGNhcmRzXHJcbiAgICBnZXREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGVjazogZnVuY3Rpb24oZGVjaykge1xyXG4gICAgICAgIE1vZGVsLmRlY2sgPSBkZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBNb2RlbC5pbml0KCk7XHJcbiAgICAgICAgVmlldy5pbml0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbk9jdG8uaW5pdCgpO1xyXG5cclxuLypcclxuICogc2V0IHVwIHRoZSBldmVudCBsaXN0ZW5lciBmb3IgYSBjYXJkLiBJZiBhIGNhcmQgaXMgY2xpY2tlZDpcclxuICogIC0gZGlzcGxheSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gYWRkIHRoZSBjYXJkIHRvIGEgKmxpc3QqIG9mIFwib3BlblwiIGNhcmRzIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBpZiB0aGUgbGlzdCBhbHJlYWR5IGhhcyBhbm90aGVyIGNhcmQsIGNoZWNrIHRvIHNlZSBpZiB0aGUgdHdvIGNhcmRzIG1hdGNoXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG1hdGNoLCBsb2NrIHRoZSBjYXJkcyBpbiB0aGUgb3BlbiBwb3NpdGlvbiAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbm90IG1hdGNoLCByZW1vdmUgdGhlIGNhcmRzIGZyb20gdGhlIGxpc3QgYW5kIGhpZGUgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaW5jcmVtZW50IHRoZSBtb3ZlIGNvdW50ZXIgYW5kIGRpc3BsYXkgaXQgb24gdGhlIHBhZ2UgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgYWxsIGNhcmRzIGhhdmUgbWF0Y2hlZCwgZGlzcGxheSBhIG1lc3NhZ2Ugd2l0aCB0aGUgZmluYWwgc2NvcmUgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqL1xyXG4iXX0=
