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
    wrongCards: function wrongCards(card, active) {
        card.classList.add('wrong');
        active.classList.add('wrong');
        card.classList.remove('show');
        active.classList.remove('show');
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.classList.remove('show');
        card2.classList.add('match');
        card2.classList.remove('show');
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
                        if (card.card === activeC.card) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwid3JvbmdDYXJkcyIsImFjdGl2ZSIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInNldE1hdGNoZWQiLCJjYXJkMSIsImNhcmQyIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsIk9jdG8iLCJnZXRBY3RpdmVDYXJkIiwic2V0QWN0aXZlQ2FyZCIsInRoZURlY2siLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiZ2V0RGVjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0Iiwic2V0RGVjayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBY0MsQ0FBZCxFQUFpQjtBQUN6QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztB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cUMsVUFBYjtBQUNILEtBVlE7O0FBWVQ7QUFDQW1CLGFBQVMsbUJBQVc7QUFDaEIsZUFBT3hELE1BQU02QixJQUFiO0FBQ0gsS0FmUTs7QUFpQlRnQyxhQUFTLGlCQUFTaEMsSUFBVCxFQUFlO0FBQ3BCN0IsY0FBTTZCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBbkJROztBQXFCVEMsVUFBTSxnQkFBVztBQUNiOUIsY0FBTThCLElBQU47QUFDQVEsYUFBS1IsSUFBTDtBQUNIO0FBeEJRLENBQWI7O0FBMkJBb0IsS0FBS3BCLElBQUw7O0FBRUEiLCJmaWxlIjoiYWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ3JlYXRlIGEgbGlzdCB0aGF0IGhvbGRzIGFsbCBvZiB5b3VyIGNhcmRzXHJcbiAqL1xyXG5cclxuXHJcbi8qXHJcbiAqIERpc3BsYXkgdGhlIGNhcmRzIG9uIHRoZSBwYWdlXHJcbiAqICAgLSBzaHVmZmxlIHRoZSBsaXN0IG9mIGNhcmRzIHVzaW5nIHRoZSBwcm92aWRlZCBcInNodWZmbGVcIiBtZXRob2QgYmVsb3dcclxuICogICAtIGxvb3AgdGhyb3VnaCBlYWNoIGNhcmQgYW5kIGNyZWF0ZSBpdHMgSFRNTFxyXG4gKiAgIC0gYWRkIGVhY2ggY2FyZCdzIEhUTUwgdG8gdGhlIHBhZ2VcclxuICovXHJcblxyXG5cclxuLy8gTVkgQVRURU1QVCB0byBidWlsZCB0aGlzIGluIGEgTU9WIGZvcm1hdFxyXG5cclxuLy8gVGhlIG1vZGVsIGhvbGRzIGFsbCB0aGUgZ2FtZXMgZGF0YS5cclxuXHJcbmNvbnN0IE1vZGVsID0ge1xyXG5cclxuICAgIGNyZWF0ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQsbikge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXQgSUQgbnVtYmVyIHRvIGEgY2FyZFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRJRCA9IG47XHJcblxyXG4gICAgICAgIC8vU2V0dXAgdGhlIGNhcmQgRE9NIHN0cnVjdHVyZSBhbmQgYXR0cmlidXRlcy5cclxuICAgICAgICBiYXNlQ2FyZC5jbGFzc05hbWUgPSAnY2FyZCc7XHJcbiAgICAgICAgYmFzZUNhcmQuZGF0YXNldC5pdGVtID0gY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbC5jbGFzc05hbWUgPSAnZmEgZmEtJyArIGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuYXBwZW5kQ2hpbGQoYmFzZUNhcmQuc3ViRWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gYmFzZUNhcmRcclxuICAgIH0sXHJcblxyXG4gICAgc2h1ZmZsZTogZnVuY3Rpb24oYXJyYXkpIHtcclxuICAgICAgICAvLyBTaHVmZmxlIGZ1bmN0aW9uIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjQ1MDk3NlxyXG4gICAgICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XHJcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W2N1cnJlbnRJbmRleF0gPSBhcnJheVtyYW5kb21JbmRleF07XHJcbiAgICAgICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0J1aWxkcyBvdXQgdGhlIGNhcmQgZGVjayBlbGVtZW50cyBpbnRvIGFuIGVhc3kgdG8gYWNjZXNzIGFycmF5XHJcbiAgICBidWlsZERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBzdGFydERlY2sgPSBbXTtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IG4gPSAwXHJcbiAgICAgICAgZm9yICh2YXIgY2FyZCBvZiB0aGlzLmNhcmRzKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0RGVjay5wdXNoKHRoYXQuY3JlYXRlQ2FyZChjYXJkLG4pKTtcclxuICAgICAgICAgICAgbisrO1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCxuKSk7XHJcbiAgICAgICAgICAgIG4rKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ2FyZCA9IGdhbWUuYWN0aXZlQ2FyZFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBbbnVsbF07XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGREZWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBWaWV3ID0ge1xyXG4gICAgLy9Jbml0aWFsaXphdGlvbiBvZiB0aGUgZ2FtZSB2aWV3LCBwbGFjZXMgZWxlbWVudHMgaW4gdGhlIERPTSAmIGFkZGluZyBldmVudCBsaXN0ZW5lcnMuXHJcbiAgICB1cGRhdGVTdGFyczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoZSB3cm9uZyBwYWlyIG9mIGNhcmRzIGFyZSBzZWxlY3RlZCwgdGhlbiBydW4gdGhpcyBmdW5jdGlvblxyXG4gICAgd3JvbmdDYXJkczogZnVuY3Rpb24oY2FyZCxhY3RpdmUpIHtcclxuICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gT2N0by5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXJkLmNhcmQgPT09IGFjdGl2ZUMuY2FyZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDEsY2FyZDJdXHJcbiAgICAgICAgICAgIDogTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IGN1cnJlbnQgZmxpcHBlZCBjYXJkXHJcbiAgICBnZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuYWN0aXZlQ2FyZDtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmluaXQoKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG4vKlxyXG4gKiBzZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBhIGNhcmQuIElmIGEgY2FyZCBpcyBjbGlja2VkOlxyXG4gKiAgLSBkaXNwbGF5IHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBhZGQgdGhlIGNhcmQgdG8gYSAqbGlzdCogb2YgXCJvcGVuXCIgY2FyZHMgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGlmIHRoZSBsaXN0IGFscmVhZHkgaGFzIGFub3RoZXIgY2FyZCwgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d28gY2FyZHMgbWF0Y2hcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbWF0Y2gsIGxvY2sgdGhlIGNhcmRzIGluIHRoZSBvcGVuIHBvc2l0aW9uIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBub3QgbWF0Y2gsIHJlbW92ZSB0aGUgY2FyZHMgZnJvbSB0aGUgbGlzdCBhbmQgaGlkZSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpbmNyZW1lbnQgdGhlIG1vdmUgY291bnRlciBhbmQgZGlzcGxheSBpdCBvbiB0aGUgcGFnZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiBhbGwgY2FyZHMgaGF2ZSBtYXRjaGVkLCBkaXNwbGF5IGEgbWVzc2FnZSB3aXRoIHRoZSBmaW5hbCBzY29yZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICovXHJcbiJdfQ==
