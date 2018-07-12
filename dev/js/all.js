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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwid3JvbmdDYXJkcyIsImNhcmQxIiwiY2FyZDIiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRNYXRjaGVkIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsIk9jdG8iLCJnZXRBY3RpdmVDYXJkIiwicmVtb3ZlIiwic2V0QWN0aXZlQ2FyZCIsInRoZURlY2siLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiZ2V0RGVjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0Iiwic2V0RGVjayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBY0MsQ0FBZCxFQUFpQjtBQUN6QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztBQUVBO0FBQ0FG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NkIsSUFBYjtBQUNILEtBZlE7O0FBaUJUK0IsYUFBUyxpQkFBUy9CLElBQVQsRUFBZTtBQUNwQjdCLGNBQU02QixJQUFOLEdBQWFBLElBQWI7QUFDSCxLQW5CUTs7QUFxQlRDLFVBQU0sZ0JBQVc7QUFDYjlCLGNBQU04QixJQUFOO0FBQ0FRLGFBQUtSLElBQUw7QUFDSDtBQXhCUSxDQUFiOztBQTJCQWtCLEtBQUtsQixJQUFMOztBQUVBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkLG4pIHtcclxuICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgLy9IYXMgdGhlIGNhcmQgYmVlbiBtYXRjaGVkIHVwPyBUaGlzIG1ha2VzIGl0IGVhc2lseSBhY2Nlc3NhYmxlIHRocm91Z2hvdXQgdGhlIGdhbWVcclxuICAgICAgICBiYXNlQ2FyZC5tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGVsbHMgd2hldGhlciB0aGUgY2FyZCBpcyBzaG93aW5nIG9yIG5vdFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0IElEIG51bWJlciB0byBhIGNhcmRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkSUQgPSBuO1xyXG5cclxuICAgICAgICAvL1NldHVwIHRoZSBjYXJkIERPTSBzdHJ1Y3R1cmUgYW5kIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGJhc2VDYXJkLmRhdGFzZXQuaXRlbSA9IGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGJhc2VDYXJkLnN1YkVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGxldCBuID0gMFxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCxuKSk7XHJcbiAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQsbikpO1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlY2sgPSB0aGlzLnNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vSWYgYSBicm93c2VyIGhhcyBsb2NhbCBnYW1lIHN0b3JhZ2UsIHRoYW4gbG9hZCB0aGF0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgZ2FtZS5cclxuICAgICAgICAvLyBMT0NBTCBTVE9SR0FFIEFCSUxJVFkgSEFTTlwiVCBCRUVOIEJVSUxUIFlFVC5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBnYW1lLmFjdGl2ZUNhcmRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQxLGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBjYXJkMS5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ3dyb25nJyk7XHJcbiAgICAgICAgY2FyZDIuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5tYXRjaCA9IHRydWU7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMi5tYXRjaCA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQ2hlY2sgd2hhdCB0aGUgY2FyZCAvIGNhcmRzIGFyZSBzZXQgYXMsIGFuZCBhY3QgYWNjb3JkaW5nbHkuXHJcbiAgICBjYXJkQ2hlY2s6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBhY3RpdmVDID0gT2N0by5nZXRBY3RpdmVDYXJkKCk7XHJcblxyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQy5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGFjdGl2ZUNbMF0sY2FyZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXJkLmNhcmQgPT09IGFjdGl2ZUMuY2FyZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRNYXRjaGVkKGNhcmQsYWN0aXZlQ1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndyb25nQ2FyZHMoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcblxyXG4gICAgc2V0QWN0aXZlQ2FyZDogZnVuY3Rpb24oY2FyZDEsY2FyZDIpIHtcclxuICAgICAgICBjYXJkMiA/IE1vZGVsLmFjdGl2ZUNhcmQgPSBbY2FyZDEsY2FyZDJdXHJcbiAgICAgICAgICAgIDogTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMV07XHJcbiAgICB9LFxyXG5cclxuICAgIC8vR2V0IGN1cnJlbnQgZmxpcHBlZCBjYXJkXHJcbiAgICBnZXRBY3RpdmVDYXJkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuYWN0aXZlQ2FyZDtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmluaXQoKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG4vKlxyXG4gKiBzZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBhIGNhcmQuIElmIGEgY2FyZCBpcyBjbGlja2VkOlxyXG4gKiAgLSBkaXNwbGF5IHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBhZGQgdGhlIGNhcmQgdG8gYSAqbGlzdCogb2YgXCJvcGVuXCIgY2FyZHMgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGlmIHRoZSBsaXN0IGFscmVhZHkgaGFzIGFub3RoZXIgY2FyZCwgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d28gY2FyZHMgbWF0Y2hcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbWF0Y2gsIGxvY2sgdGhlIGNhcmRzIGluIHRoZSBvcGVuIHBvc2l0aW9uIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBub3QgbWF0Y2gsIHJlbW92ZSB0aGUgY2FyZHMgZnJvbSB0aGUgbGlzdCBhbmQgaGlkZSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpbmNyZW1lbnQgdGhlIG1vdmUgY291bnRlciBhbmQgZGlzcGxheSBpdCBvbiB0aGUgcGFnZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiBhbGwgY2FyZHMgaGF2ZSBtYXRjaGVkLCBkaXNwbGF5IGEgbWVzc2FnZSB3aXRoIHRoZSBmaW5hbCBzY29yZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICovXHJcbiJdfQ==
