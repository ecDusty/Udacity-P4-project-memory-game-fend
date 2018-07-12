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
        } else {
            this.cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'];

            this.buildDeck();
        }
    }
};

var View = {
    //Initialization of the game view, places elements in the DOM & adding event listeners.
    updateStars: function updateStars() {},

    //The wrong pair of cards are selected, then run this function
    wrongCards: function wrongCards() {},

    //Check what the card / cards are set as, and act accordingly.
    cardCheck: function cardCheck(card) {
        if (!card.match) {
            if (card.cardShow) {
                card.cardShow = false;
                card.classList.remove('show');
            } else {
                card.cardShow = true;
                card.classList.add('show');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJNb2RlbCIsImNyZWF0ZUNhcmQiLCJjYXJkIiwiYmFzZUNhcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdWJFbCIsIm1hdGNoIiwiY2FyZFNob3ciLCJjbGFzc05hbWUiLCJkYXRhc2V0IiwiaXRlbSIsImFwcGVuZENoaWxkIiwic2h1ZmZsZSIsImFycmF5IiwiY3VycmVudEluZGV4IiwibGVuZ3RoIiwidGVtcG9yYXJ5VmFsdWUiLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImJ1aWxkRGVjayIsInN0YXJ0RGVjayIsInRoYXQiLCJjYXJkcyIsInB1c2giLCJkZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsIlZpZXciLCJ1cGRhdGVTdGFycyIsIndyb25nQ2FyZHMiLCJjYXJkQ2hlY2siLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJ0aGVEZWNrIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlubmVySFRNTCIsIk9jdG8iLCJnZXREZWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJlbCIsImN1cnJlbnRUYXJnZXQiLCJzZXREZWNrIl0sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0FBS0E7Ozs7Ozs7QUFRQTs7QUFFQTs7QUFFQSxJQUFNQSxRQUFROztBQUVWQyxnQkFBWSxvQkFBU0MsSUFBVCxFQUFlO0FBQ3ZCLFlBQU1DLFdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsSUFBdkIsQ0FBakI7QUFDQUYsaUJBQVNHLEtBQVQsR0FBaUJGLFNBQVNDLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBakI7O0FBRUE7QUFDQUYsaUJBQVNELElBQVQsR0FBZ0JBLElBQWhCOztBQUVBO0FBQ0FDLGlCQUFTSSxLQUFULEdBQWlCLEtBQWpCO0FBQ0E7QUFDQUosaUJBQVNLLFFBQVQsR0FBb0IsS0FBcEI7O0FBRUE7QUFDQUws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a0IsT0FBTCxHQUFldEMsU0FBU3VDLHNCQUFULENBQWdDLE1BQWhDLEVBQXdDLENBQXhDLENBQWY7QUFDQSxhQUFLRCxPQUFMLENBQWFFLFNBQWIsR0FBeUIsRUFBekI7O0FBSGE7QUFBQTtBQUFBOztBQUFBO0FBS2Isa0NBQWlCQyxLQUFLQyxPQUFMLEVBQWpCLG1JQUFnQztBQUFBLG9CQUF2QjVDLElBQXVCOztBQUM1QkEscUJBQUs2QyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFTQyxDQUFULEVBQVk7QUFDdkMsd0JBQU1DLEtBQUtELEVBQUVFLGFBQWI7QUFDQTFCLHlCQUFLYyxTQUFMLENBQWVXLEVBQWY7QUFDSCxpQkFIRDtBQUlBLHFCQUFLUCxPQUFMLENBQWE5QixXQUFiLENBQXlCVixJQUF6QjtBQUNIO0FBWFk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVloQjtBQXBDUSxDQUFiOztBQXVDQSxJQUFNMkMsT0FBTztBQUNUO0FBQ0FDLGFBQVMsbUJBQVc7QUFDaEIsZUFBTzlDLE1BQU0yQixJQUFiO0FBQ0gsS0FKUTs7QUFNVHdCLGFBQVMsaUJBQVN4QixJQUFULEVBQWU7QUFDcEIzQixjQUFNMkIsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0FSUTs7QUFVVEMsVUFBTSxnQkFBVztBQUNiNUIsY0FBTTRCLElBQU47QUFDQU8sYUFBS1AsSUFBTDtBQUNIO0FBYlEsQ0FBYjs7QUFnQkFpQixLQUFLakIsSUFBTDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIGJ1aWxkIHRoaXMgaW4gYSBNT1YgZm9ybWF0XHJcblxyXG4vLyBUaGUgbW9kZWwgaG9sZHMgYWxsIHRoZSBnYW1lcyBkYXRhLlxyXG5cclxuY29uc3QgTW9kZWwgPSB7XHJcblxyXG4gICAgY3JlYXRlQ2FyZDogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGNvbnN0IGJhc2VDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcclxuICAgICAgICBiYXNlQ2FyZC5zdWJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHJcbiAgICAgICAgLy9QbGFjZSB0aGUgbmFtZSBvZiB0aGUgY2FyZCB3aXRoIHRoZSBPYmplY3QgZWxlbWVudFxyXG4gICAgICAgIGJhc2VDYXJkLmNhcmQgPSBjYXJkO1xyXG5cclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRTaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS5jdXJyZW50VGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5jYXJkQ2hlY2soZWwpO1xyXG4gICAgICAgICAgICB9KTsgXHJcbiAgICAgICAgICAgIHRoaXMudGhlRGVjay5hcHBlbmRDaGlsZChjYXJkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IE9jdG8gPSB7XHJcbiAgICAvL0dldCB0aGUgY3VycmVudCBhcnJheSBvZiBjYXJkc1xyXG4gICAgZ2V0RGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIE1vZGVsLmRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldERlY2s6IGZ1bmN0aW9uKGRlY2spIHtcclxuICAgICAgICBNb2RlbC5kZWNrID0gZGVjaztcclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5PY3RvLmluaXQoKTtcclxuXHJcbi8qXHJcbiAqIHNldCB1cCB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIGEgY2FyZC4gSWYgYSBjYXJkIGlzIGNsaWNrZWQ6XHJcbiAqICAtIGRpc3BsYXkgdGhlIGNhcmQncyBzeW1ib2wgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGFkZCB0aGUgY2FyZCB0byBhICpsaXN0KiBvZiBcIm9wZW5cIiBjYXJkcyAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogIC0gaWYgdGhlIGxpc3QgYWxyZWFkeSBoYXMgYW5vdGhlciBjYXJkLCBjaGVjayB0byBzZWUgaWYgdGhlIHR3byBjYXJkcyBtYXRjaFxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBtYXRjaCwgbG9jayB0aGUgY2FyZHMgaW4gdGhlIG9wZW4gcG9zaXRpb24gKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAgICsgaWYgdGhlIGNhcmRzIGRvIG5vdCBtYXRjaCwgcmVtb3ZlIHRoZSBjYXJkcyBmcm9tIHRoZSBsaXN0IGFuZCBoaWRlIHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGluY3JlbWVudCB0aGUgbW92ZSBjb3VudGVyIGFuZCBkaXNwbGF5IGl0IG9uIHRoZSBwYWdlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIGFsbCBjYXJkcyBoYXZlIG1hdGNoZWQsIGRpc3BsYXkgYSBtZXNzYWdlIHdpdGggdGhlIGZpbmFsIHNjb3JlIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKi9cclxuIl19
