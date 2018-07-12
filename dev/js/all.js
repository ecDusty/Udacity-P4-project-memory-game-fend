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

//testing clicking functionality
var cards = document.getElementsByClassName('card');

var _loop = function _loop() {
    var that = card;
    card.addEventListener('click', function (el) {
        console.log(el);
        that.classList.contains('show') ? that.classList.remove('show') : that.classList.add('show');
    });
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var card = _step.value;

        _loop();
    }

    // MY ATTEMPT to build this in a MOV format

    // The model holds all the games data.
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

var Model = {

    createCard: function createCard(card) {
        var baseCard = document.createElement('li');

        //Place the name of the card with the Object element
        baseCard.card = card;
        //Has the card been matched up? This makes it easily accessable throughout the game
        baseCard.match = false;
        //Tells whether the card is showing or not
        baseCard.cardShow = false;

        //Setup the card DOM structure and attributes.
        baseCard.className = 'card';
        console.log(card);
        baseCard.dataset.item = card;
        baseCard.subEl = document.createElement('i');
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.cards[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var card = _step2.value;

                console.log('Array card:\n' + card);
                startDeck.push(that.createCard(card));
                startDeck.push(that.createCard(card));
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
                card.cardShow = true;
                card.classList.add('show');
            } else {
                card.cardShow = false;
                card.classList.remove('show');
            }
        }
        console.log(card.match + '\n' + card.card);
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
                    var el = e.target;
                    that.cardCheck(el);
                    if (!el.classList.contains('match')) {
                        el.classList.contains('show') ? el.classList.remove('show') : el.classList.add('show');
                    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjYXJkcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsInRoYXQiLCJjYXJkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVsIiwiY29uc29sZSIsImxvZyIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwicmVtb3ZlIiwiYWRkIiwiTW9kZWwiLCJjcmVhdGVDYXJkIiwiYmFzZUNhcmQiLCJjcmVhdGVFbGVtZW50IiwibWF0Y2giLCJjYXJkU2hvdyIsImNsYXNzTmFtZSIsImRhdGFzZXQiLCJpdGVtIiwic3ViRWwiLCJhcHBlbmRDaGlsZCIsInNodWZmbGUiLCJhcnJheSIsImN1cnJlbnRJbmRleCIsImxlbmd0aCIsInRlbXBvcmFyeVZhbHVlIiwicmFuZG9tSW5kZXgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJidWlsZERlY2siLCJzdGFydERlY2siLCJwdXNoIiwiZGVjayIsImluaXQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZ2FtZSIsIm1vdmVzIiwidGltZSIsInJlY29yZFRpbWUiLCJWaWV3IiwidXBkYXRlU3RhcnMiLCJ3cm9uZ0NhcmRzIiwiY2FyZENoZWNrIiwidGhlRGVjayIsImlubmVySFRNTCIsIk9jdG8iLCJnZXREZWNrIiwiZSIsInRhcmdldCIsInNldERlY2siXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFLQTs7Ozs7OztBQVVBO0FBQ0EsSUFBTUEsUUFBUUMsU0FBU0Msc0JBQVQsQ0FBZ0MsTUFBaEMsQ0FBZDs7O0FBR0ksUUFBSUMsT0FBT0MsSUFBWDtBQUNBQSxTQUFLQyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFTQyxFQUFULEVBQWE7QUFDeENDLGdCQUFRQyxHQUFSLENBQVlGLEVBQVo7QUFDQUgsYUFBS00sU0FBTCxDQUFlQyxRQUFmLENBQXdCLE1BQXhCLElBQ0lQLEtBQUtNLFNBQUwsQ0FBZUUsTUFBZixDQUFzQixNQUF0QixDQURKLEdBRU1SLEtBQUtNLFNBQUws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U0FBSCxDQUFhQyxRQUFiLENBQXNCLE1BQXRCLElBQ0lKLEdBQUdHLFNBQUgsQ0FBYUUsTUFBYixDQUFvQixNQUFwQixDQURKLEdBRU1MLEdBQUdHLFNBQUgsQ0FBYUcsR0FBYixDQUFpQixNQUFqQixDQUZOO0FBR0g7QUFDSixpQkFSRDtBQVNBLHFCQUFLb0MsT0FBTCxDQUFhekIsV0FBYixDQUF5Qm5CLElBQXpCO0FBQ0g7QUFoQlk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWlCaEI7QUExQ1EsQ0FBYjs7QUE2Q0EsSUFBTThDLE9BQU87QUFDVDtBQUNBQyxhQUFTLG1CQUFXO0FBQ2hCLGVBQU90QyxNQUFNdUIsSUFBYjtBQUNILEtBSlE7O0FBTVRrQixhQUFTLGlCQUFTbEIsSUFBVCxFQUFlO0FBQ3BCdkIsY0FBTXVCLElBQU4sR0FBYUEsSUFBYjtBQUNILEtBUlE7O0FBVVRDLFVBQU0sZ0JBQVc7QUFDYnhCLGNBQU13QixJQUFOO0FBQ0FPLGFBQUtQLElBQUw7QUFDSDtBQWJRLENBQWI7O0FBZ0JBYSxLQUFLYixJQUFMOztBQUVBIiwiZmlsZSI6ImFsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENyZWF0ZSBhIGxpc3QgdGhhdCBob2xkcyBhbGwgb2YgeW91ciBjYXJkc1xyXG4gKi9cclxuXHJcblxyXG4vKlxyXG4gKiBEaXNwbGF5IHRoZSBjYXJkcyBvbiB0aGUgcGFnZVxyXG4gKiAgIC0gc2h1ZmZsZSB0aGUgbGlzdCBvZiBjYXJkcyB1c2luZyB0aGUgcHJvdmlkZWQgXCJzaHVmZmxlXCIgbWV0aG9kIGJlbG93XHJcbiAqICAgLSBsb29wIHRocm91Z2ggZWFjaCBjYXJkIGFuZCBjcmVhdGUgaXRzIEhUTUxcclxuICogICAtIGFkZCBlYWNoIGNhcmQncyBIVE1MIHRvIHRoZSBwYWdlXHJcbiAqL1xyXG5cclxuXHJcblxyXG5cclxuLy90ZXN0aW5nIGNsaWNraW5nIGZ1bmN0aW9uYWxpdHlcclxuY29uc3QgY2FyZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXJkJyk7XHJcblxyXG5mb3IgKHZhciBjYXJkIG9mIGNhcmRzKSB7XHJcbiAgICBsZXQgdGhhdCA9IGNhcmRcclxuICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVsKVxyXG4gICAgICAgIHRoYXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykgPyBcclxuICAgICAgICAgICAgdGhhdC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93JykgXHJcbiAgICAgICAgICAgIDogdGhhdC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XHJcbiAgICB9KTsgXHJcbn1cclxuXHJcblxyXG5cclxuLy8gTVkgQVRURU1QVCB0byBidWlsZCB0aGlzIGluIGEgTU9WIGZvcm1hdFxyXG5cclxuLy8gVGhlIG1vZGVsIGhvbGRzIGFsbCB0aGUgZ2FtZXMgZGF0YS5cclxuXHJcbmNvbnN0IE1vZGVsID0ge1xyXG5cclxuICAgIGNyZWF0ZUNhcmQ6IGZ1bmN0aW9uKGNhcmQpIHtcclxuICAgICAgICBjb25zdCBiYXNlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XHJcblxyXG4gICAgICAgIC8vUGxhY2UgdGhlIG5hbWUgb2YgdGhlIGNhcmQgd2l0aCB0aGUgT2JqZWN0IGVsZW1lbnRcclxuICAgICAgICBiYXNlQ2FyZC5jYXJkID0gY2FyZDtcclxuICAgICAgICAvL0hhcyB0aGUgY2FyZCBiZWVuIG1hdGNoZWQgdXA/IFRoaXMgbWFrZXMgaXQgZWFzaWx5IGFjY2Vzc2FibGUgdGhyb3VnaG91dCB0aGUgZ2FtZVxyXG4gICAgICAgIGJhc2VDYXJkLm1hdGNoID0gZmFsc2U7XHJcbiAgICAgICAgLy9UZWxscyB3aGV0aGVyIHRoZSBjYXJkIGlzIHNob3dpbmcgb3Igbm90XHJcbiAgICAgICAgYmFzZUNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy9TZXR1cCB0aGUgY2FyZCBET00gc3RydWN0dXJlIGFuZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgIGJhc2VDYXJkLmNsYXNzTmFtZSA9ICdjYXJkJztcclxuICAgICAgICBjb25zb2xlLmxvZyhjYXJkKTtcclxuICAgICAgICBiYXNlQ2FyZC5kYXRhc2V0Lml0ZW0gPSBjYXJkO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG4gICAgICAgIGJhc2VDYXJkLnN1YkVsLmNsYXNzTmFtZSA9ICdmYSBmYS0nICsgY2FyZDtcclxuICAgICAgICBiYXNlQ2FyZC5hcHBlbmRDaGlsZChiYXNlQ2FyZC5zdWJFbCk7XHJcblxyXG4gICAgICAgIHJldHVybiBiYXNlQ2FyZFxyXG4gICAgfSxcclxuXHJcbiAgICBzaHVmZmxlOiBmdW5jdGlvbihhcnJheSkge1xyXG4gICAgICAgIC8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCwgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xyXG5cclxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcclxuICAgICAgICAgICAgY3VycmVudEluZGV4IC09IDE7XHJcbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcclxuICAgICAgICAgICAgYXJyYXlbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vQnVpbGRzIG91dCB0aGUgY2FyZCBkZWNrIGVsZW1lbnRzIGludG8gYW4gZWFzeSB0byBhY2Nlc3MgYXJyYXlcclxuICAgIGJ1aWxkRGVjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0RGVjayA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIHRoaXMuY2FyZHMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FycmF5IGNhcmQ6XFxuJytjYXJkKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICAgICAgc3RhcnREZWNrLnB1c2godGhhdC5jcmVhdGVDYXJkKGNhcmQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZGVjayA9IHRoaXMuc2h1ZmZsZShzdGFydERlY2spO1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1RoaXMgcnVucyBvbiBnYW1lIHN0YXJ0LlxyXG4gICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy9JZiBhIGJyb3dzZXIgaGFzIGxvY2FsIGdhbWUgc3RvcmFnZSwgdGhhbiBsb2FkIHRoYXQgaW5zdGVhZCBvZiBjcmVhdGluZyBhIG5ldyBnYW1lLlxyXG4gICAgICAgIC8vIExPQ0FMIFNUT1JHQUUgQUJJTElUWSBIQVNOXCJUIEJFRU4gQlVJTFQgWUVULlxyXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZWNtTWVtR2FtZScpO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVzID0gZ2FtZS5tb3ZlcztcclxuICAgICAgICAgICAgdGhpcy50aW1lID0gZ2FtZS50aW1lO1xyXG4gICAgICAgICAgICB0aGlzLnJlY29yZFRpbWUgPSBnYW1lLnJlY29yZFRpbWU7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBnYW1lLmNhcmRzO1xyXG4gICAgICAgICAgICB0aGlzLmRlY2sgPSBnYW1lLmRlY2s7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jYXJkcyA9IFtcclxuICAgICAgICAgICAgICAgICdkaWFtb25kJyxcclxuICAgICAgICAgICAgICAgICdwYXBlci1wbGFuZS1vJyxcclxuICAgICAgICAgICAgICAgICdhbmNob3InLFxyXG4gICAgICAgICAgICAgICAgJ2JvbHQnLFxyXG4gICAgICAgICAgICAgICAgJ2N1YmUnLFxyXG4gICAgICAgICAgICAgICAgJ2xlYWYnLFxyXG4gICAgICAgICAgICAgICAgJ2JpY3ljbGUnLFxyXG4gICAgICAgICAgICAgICAgJ2JvbWInXHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkRGVjaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgVmlldyA9IHtcclxuICAgIC8vSW5pdGlhbGl6YXRpb24gb2YgdGhlIGdhbWUgdmlldywgcGxhY2VzIGVsZW1lbnRzIGluIHRoZSBET00gJiBhZGRpbmcgZXZlbnQgbGlzdGVuZXJzLlxyXG4gICAgdXBkYXRlU3RhcnM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9UaGUgd3JvbmcgcGFpciBvZiBjYXJkcyBhcmUgc2VsZWN0ZWQsIHRoZW4gcnVuIHRoaXMgZnVuY3Rpb25cclxuICAgIHdyb25nQ2FyZHM6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy9DaGVjayB3aGF0IHRoZSBjYXJkIC8gY2FyZHMgYXJlIHNldCBhcywgYW5kIGFjdCBhY2NvcmRpbmdseS5cclxuICAgIGNhcmRDaGVjazogZnVuY3Rpb24oY2FyZCkge1xyXG4gICAgICAgIGlmICghY2FyZC5tYXRjaCkge1xyXG4gICAgICAgICAgICBpZiAoY2FyZC5jYXJkU2hvdykge1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkU2hvdyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYXJkLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZFNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGNhcmQubWF0Y2grJ1xcbicrY2FyZC5jYXJkKVxyXG4gICAgfSxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgICAgICB0aGlzLnRoZURlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWNrJylbMF07XHJcbiAgICAgICAgdGhpcy50aGVEZWNrLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBjYXJkIG9mIE9jdG8uZ2V0RGVjaygpKXtcclxuICAgICAgICAgICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsID0gZS50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmNhcmRDaGVjayhlbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWVsLmNsYXNzTGlzdC5jb250YWlucygnbWF0Y2gnKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaG93JykgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGVsLmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7IFxyXG4gICAgICAgICAgICB0aGlzLnRoZURlY2suYXBwZW5kQ2hpbGQoY2FyZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBPY3RvID0ge1xyXG4gICAgLy9HZXQgdGhlIGN1cnJlbnQgYXJyYXkgb2YgY2FyZHNcclxuICAgIGdldERlY2s6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBNb2RlbC5kZWNrO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXREZWNrOiBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIE1vZGVsLmluaXQoKTtcclxuICAgICAgICBWaWV3LmluaXQoKTtcclxuICAgIH1cclxufVxyXG5cclxuT2N0by5pbml0KCk7XHJcblxyXG4vKlxyXG4gKiBzZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBhIGNhcmQuIElmIGEgY2FyZCBpcyBjbGlja2VkOlxyXG4gKiAgLSBkaXNwbGF5IHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBhZGQgdGhlIGNhcmQgdG8gYSAqbGlzdCogb2YgXCJvcGVuXCIgY2FyZHMgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGlmIHRoZSBsaXN0IGFscmVhZHkgaGFzIGFub3RoZXIgY2FyZCwgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d28gY2FyZHMgbWF0Y2hcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbWF0Y2gsIGxvY2sgdGhlIGNhcmRzIGluIHRoZSBvcGVuIHBvc2l0aW9uIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBub3QgbWF0Y2gsIHJlbW92ZSB0aGUgY2FyZHMgZnJvbSB0aGUgbGlzdCBhbmQgaGlkZSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpbmNyZW1lbnQgdGhlIG1vdmUgY291bnRlciBhbmQgZGlzcGxheSBpdCBvbiB0aGUgcGFnZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiBhbGwgY2FyZHMgaGF2ZSBtYXRjaGVkLCBkaXNwbGF5IGEgbWVzc2FnZSB3aXRoIHRoZSBmaW5hbCBzY29yZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICovXHJcbiJdfQ==
