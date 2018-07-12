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
        card.classList.remove('show');
        card.cardShow = false;
        active.classList.add('wrong');
        active.classList.remove('show');
        card.cardShow = false;
    },

    setMatched: function setMatched(card1, card2) {
        card1.classList.add('match');
        card1.classList.remove('show');
        card1.match = true;
        card2.classList.add('match');
        card2.classList.remove('show');
        card1.match = true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwibiIsImJhc2VDYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3ViRWwiLCJtYXRjaCIsImNhcmRTaG93IiwiY2FyZElEIiwiY2xhc3NOYW1lIiwiZGF0YXNldCIsIml0ZW0iLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJ0aGF0IiwiY2FyZHMiLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJhY3RpdmVDYXJkIiwiVmlldyIsInVwZGF0ZVN0YXJzIiwid3JvbmdDYXJkcyIsImFjdGl2ZSIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInNldE1hdGNoZWQiLCJjYXJkMSIsImNhcmQyIiwiY2FyZENoZWNrIiwiYWN0aXZlQyIsIk9jdG8iLCJnZXRBY3RpdmVDYXJkIiwic2V0QWN0aXZlQ2FyZCIsInRoZURlY2siLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaW5uZXJIVE1MIiwiZ2V0RGVjayIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwiZWwiLCJjdXJyZW50VGFyZ2V0Iiwic2V0RGVjayJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBUUE7O0FBRUE7O0FBRUEsSUFBTUEsUUFBUTs7QUFFVkMsZ0JBQVksb0JBQVNDLElBQVQsRUFBY0MsQ0FBZCxFQUFpQjtBQUN6QixZQUFNQyxXQUFXQyxTQUFTQyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0FGLGlCQUFTRyxLQUFULEdBQWlCRixTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQWpCOztB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Q0FBQ1MsS0FBRCxFQUFPQyxLQUFQLENBQTNCLEdBQ00vQyxNQUFNcUMsVUFBTixHQUFtQixDQUFDUyxLQUFELENBRHpCO0FBRUgsS0FMUTs7QUFPVDtBQUNBSyxtQkFBZSx5QkFBVztBQUN0QixlQUFPbkQsTUFBTXFDLFVBQWI7QUFDSCxLQVZROztBQVlUO0FBQ0FtQixhQUFTLG1CQUFXO0FBQ2hCLGVBQU94RCxNQUFNNkIsSUFBYjtBQUNILEtBZlE7O0FBaUJUZ0MsYUFBUyxpQkFBU2hDLElBQVQsRUFBZTtBQUNwQjdCLGNBQU02QixJQUFOLEdBQWFBLElBQWI7QUFDSCxLQW5CUTs7QUFxQlRDLFVBQU0sZ0JBQVc7QUFDYjlCLGNBQU04QixJQUFOO0FBQ0FRLGFBQUtSLElBQUw7QUFDSDtBQXhCUSxDQUFiOztBQTJCQW9CLEtBQUtwQixJQUFMOztBQUVBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcbi8vIE1ZIEFUVEVNUFQgdG8gYnVpbGQgdGhpcyBpbiBhIE1PViBmb3JtYXRcclxuXHJcbi8vIFRoZSBtb2RlbCBob2xkcyBhbGwgdGhlIGdhbWVzIGRhdGEuXHJcblxyXG5jb25zdCBNb2RlbCA9IHtcclxuXHJcbiAgICBjcmVhdGVDYXJkOiBmdW5jdGlvbihjYXJkLG4pIHtcclxuICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuXHJcbiAgICAgICAgLy9IYXMgdGhlIGNhcmQgYmVlbiBtYXRjaGVkIHVwPyBUaGlzIG1ha2VzIGl0IGVhc2lseSBhY2Nlc3NhYmxlIHRocm91Z2hvdXQgdGhlIGdhbWVcclxuICAgICAgICBiYXNlQ2FyZC5tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vVGVsbHMgd2hldGhlciB0aGUgY2FyZCBpcyBzaG93aW5nIG9yIG5vdFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vU2V0IElEIG51bWJlciB0byBhIGNhcmRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkSUQgPSBuO1xyXG5cclxuICAgICAgICAvL1NldHVwIHRoZSBjYXJkIERPTSBzdHJ1Y3R1cmUgYW5kIGF0dHJpYnV0ZXMuXHJcbiAgICAgICAgYmFzZUNhcmQuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGJhc2VDYXJkLmRhdGFzZXQuaXRlbSA9IGNhcmQ7XHJcbiAgICAgICAgYmFzZUNhcmQuc3ViRWwuY2xhc3NOYW1lID0gJ2ZhIGZhLScgKyBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLmFwcGVuZENoaWxkKGJhc2VDYXJkLnN1YkVsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJhc2VDYXJkXHJcbiAgICB9LFxyXG5cclxuICAgIHNodWZmbGU6IGZ1bmN0aW9uKGFycmF5KSB7XHJcbiAgICAgICAgLy8gU2h1ZmZsZSBmdW5jdGlvbiBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI0NTA5NzZcclxuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoLCB0ZW1wb3JhcnlWYWx1ZSwgcmFuZG9tSW5kZXg7XHJcblxyXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcclxuICAgICAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcclxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9CdWlsZHMgb3V0IHRoZSBjYXJkIGRlY2sgZWxlbWVudHMgaW50byBhbiBlYXN5IHRvIGFjY2VzcyBhcnJheVxyXG4gICAgYnVpbGREZWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgc3RhcnREZWNrID0gW107XHJcbiAgICAgICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAgIGxldCBuID0gMFxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgdGhpcy5jYXJkcykge1xyXG4gICAgICAgICAgICBzdGFydERlY2sucHVzaCh0aGF0LmNyZWF0ZUNhcmQoY2FyZCxuKSk7XHJcbiAgICAgICAgICAgIG4rKztcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQsbikpO1xyXG4gICAgICAgICAgICBuKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRlY2sgPSB0aGlzLnNodWZmbGUoc3RhcnREZWNrKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGlzIHJ1bnMgb24gZ2FtZSBzdGFydC5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vSWYgYSBicm93c2VyIGhhcyBsb2NhbCBnYW1lIHN0b3JhZ2UsIHRoYW4gbG9hZCB0aGF0IGluc3RlYWQgb2YgY3JlYXRpbmcgYSBuZXcgZ2FtZS5cclxuICAgICAgICAvLyBMT0NBTCBTVE9SR0FFIEFCSUxJVFkgSEFTTlwiVCBCRUVOIEJVSUxUIFlFVC5cclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNhcmQgPSBnYW1lLmFjdGl2ZUNhcmRcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gW1xyXG4gICAgICAgICAgICAgICAgJ2RpYW1vbmQnLFxyXG4gICAgICAgICAgICAgICAgJ3BhcGVyLXBsYW5lLW8nLFxyXG4gICAgICAgICAgICAgICAgJ2FuY2hvcicsXHJcbiAgICAgICAgICAgICAgICAnYm9sdCcsXHJcbiAgICAgICAgICAgICAgICAnY3ViZScsXHJcbiAgICAgICAgICAgICAgICAnbGVhZicsXHJcbiAgICAgICAgICAgICAgICAnYmljeWNsZScsXHJcbiAgICAgICAgICAgICAgICAnYm9tYidcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDYXJkID0gW251bGxdO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKGNhcmQsYWN0aXZlKSB7XHJcbiAgICAgICAgY2FyZC5jbGFzc0xpc3QuYWRkKCd3cm9uZycpO1xyXG4gICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LmFkZCgnd3JvbmcnKTtcclxuICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0TWF0Y2hlZDogZnVuY3Rpb24oY2FyZDEsIGNhcmQyKSB7XHJcbiAgICAgICAgY2FyZDEuY2xhc3NMaXN0LmFkZCgnbWF0Y2gnKTtcclxuICAgICAgICBjYXJkMS5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgY2FyZDEubWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgIGNhcmQyLmNsYXNzTGlzdC5hZGQoJ21hdGNoJyk7XHJcbiAgICAgICAgY2FyZDIuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgIGNhcmQxLm1hdGNoID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUMgPSBPY3RvLmdldEFjdGl2ZUNhcmQoKTtcclxuXHJcbiAgICAgICAgaWYgKCFjYXJkLm1hdGNoKSB7XHJcbiAgICAgICAgICAgIGlmIChjYXJkLmNhcmRTaG93KSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIE9jdG8uc2V0QWN0aXZlQ2FyZChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhY3RpdmVDLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBPY3RvLnNldEFjdGl2ZUNhcmQoYWN0aXZlQ1swXSxjYXJkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhcmQuY2FyZCA9PT0gYWN0aXZlQy5jYXJkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE1hdGNoZWQoY2FyZCxhY3RpdmVDWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMud3JvbmdDYXJkcyhjYXJkLGFjdGl2ZUNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgT2N0by5zZXRBY3RpdmVDYXJkKGNhcmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMudGhlRGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlY2snKVswXTtcclxuICAgICAgICB0aGlzLnRoZURlY2suaW5uZXJIVE1MID0gJyc7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGNhcmQgb2YgT2N0by5nZXREZWNrKCkpe1xyXG4gICAgICAgICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWwgPSBlLmN1cnJlbnRUYXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgIH0pOyBcclxuICAgICAgICAgICAgdGhpcy50aGVEZWNrLmFwcGVuZENoaWxkKGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgT2N0byA9IHtcclxuXHJcbiAgICBzZXRBY3RpdmVDYXJkOiBmdW5jdGlvbihjYXJkMSxjYXJkMikge1xyXG4gICAgICAgIGNhcmQyID8gTW9kZWwuYWN0aXZlQ2FyZCA9IFtjYXJkMSxjYXJkMl1cclxuICAgICAgICAgICAgOiBNb2RlbC5hY3RpdmVDYXJkID0gW2NhcmQxXTtcclxuICAgIH0sXHJcblxyXG4gICAgLy9HZXQgY3VycmVudCBmbGlwcGVkIGNhcmRcclxuICAgIGdldEFjdGl2ZUNhcmQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5hY3RpdmVDYXJkO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbi8qXHJcbiAqIHNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIGEgY2FyZC4gSWYgYSBjYXJkIGlzIGNsaWNrZWQ6XHJcbiAqICAtIGRpc3BsYXkgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGFkZCB0aGUgY2FyZCB0byBhICpsaXN0KiBvZiBcIm9wZW5cIiBjYXJkcyAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gaWYgdGhlIGxpc3QgYWxyZWFkeSBoYXMgYW5vdGhlciBjYXJkLCBjaGVjayB0byBzZWUgaWYgdGhlIHR3byBjYXJkcyBtYXRjaFxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBtYXRjaCwgbG9jayB0aGUgY2FyZHMgaW4gdGhlIG9wZW4gcG9zaXRpb24gKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG5vdCBtYXRjaCwgcmVtb3ZlIHRoZSBjYXJkcyBmcm9tIHRoZSBsaXN0IGFuZCBoaWRlIHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGluY3JlbWVudCB0aGUgbW92ZSBjb3VudGVyIGFuZCBkaXNwbGF5IGl0IG9uIHRoZSBwYWdlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIGFsbCBjYXJkcyBoYXZlIG1hdGNoZWQsIGRpc3BsYXkgYSBtZXNzYWdlIHdpdGggdGhlIGZpbmFsIHNjb3JlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKi9cclxuIl19
