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

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
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
}

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

    // MY ATTEMPT to order this games code.
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

function Model() {

    this.buildDeck = function () {
        var builtDeck = [];

        return builtDeck;
    };

    this.init = function () {
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

        return this.deck;
    };
}

function View() {

    this.init = function () {};
}

function Octo() {

    this.getDeck = function () {
        return Model.deck;
    };

    this.setDeck = function (deck) {
        Model.deck = deck;
    };

    this.init = function () {
        Model.init();
        View.init();
    };
}

var Game = new Octo();
Game.init();

shuffle(Model.cards);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJzaHVmZmxlIiwiYXJyYXkiLCJjdXJyZW50SW5kZXgiLCJsZW5ndGgiLCJ0ZW1wb3JhcnlWYWx1ZSIsInJhbmRvbUluZGV4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY2FyZHMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJ0aGF0IiwiY2FyZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbCIsImNvbnNvbGUiLCJsb2ciLCJjbGFzc0xpc3QiLCJjb250YWlucyIsInJlbW92ZSIsImFkZCIsIk1vZGVsIiwiYnVpbGREZWNrIiwiYnVpbHREZWNrIiwiaW5pdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJnYW1lIiwibW92ZXMiLCJ0aW1lIiwicmVjb3JkVGltZSIsImRlY2siLCJWaWV3IiwiT2N0byIsImdldERlY2siLCJzZXREZWNrIiwiR2FtZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztBQUtBOzs7Ozs7O0FBT0E7QUFDQSxTQUFTQSxPQUFULENBQWlCQyxLQUFqQixFQUF3QjtBQUNwQixRQUFJQyxlQUFlRCxNQUFNRSxNQUF6QjtBQUFBLFFBQWlDQyxjQUFqQztBQUFBLFFBQWlEQyxXQUFqRDs7QUFFQSxXQUFPSCxpQkFBaUIsQ0FBeEIsRUFBMkI7QUFDdkJHLHNCQUFjQyxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBZ0JOLFlBQTNCLENBQWQ7QUFDQUEsd0JBQWdCLENBQWhCO0FBQ0FFLHlCQUFpQkgsTUFBTUMsWUFBTixDQUFqQjtBQUNBRCxjQUFNQyxZQUFOLElBQXNCRCxNQUFNSSxXQUFOLENBQXRCO0FBQ0FKLGNBQU1JLFdBQU4sSUFBcUJELGNBQXJCO0FBQ0g7O0FBRUQsV0FBT0gsS0FBUDtBQUNIOztBQUlELElBQU1RLFFBQVFDLFNBQVNDLHNCQUFULENBQWdDLE1BQWhDLENBQWQ7OztBQUdJLFFBQUlDLE9BQU9DLElBQVg7QUFDQUEsU0FBS0MsZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBU0MsRUFBVCxFQUFhO0FBQ3hDQyxnQkFBUUMsR0FBUixDQUFZRixFQUFaO0FBQ0FILGFBQUtNLFNBQUwsQ0FBZUMsUUFBZixDQUF3QixNQUF4QixJQUNJUCxLQUFLTSxTQUFMLENBQWVFLE1BQWYsQ0FBc0IsTUFBdEIsQ0FESixHQUVNUixLQUFLTSxTQUFMLENBQWVHLEdBQWYsQ0FBbUIsTUFBbkIsQ0FGTjtBQUdILEtBTEQ7Ozs7Ozs7O0FBRkoseUJBQWlCWixLQUFqQiw4SEFBd0I7QUFBQSxZQUFmSSxJQUFlOztBQUFBO0FBUXZCOztBQUlEOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsU0FBU1MsS0FBVCxHQUFpQjs7QUFFYixTQUFLQyxTQUFMLEdBQWlCLFlBQVc7QUFDeEIsWUFBSUMsWUFBWSxFQUFoQjs7QUFFQSxlQUFPQSxTQUFQO0FBQ0gsS0FKRDs7QUFNQSxTQUFLQyxJQUFMLEdBQVksWUFBVztBQUNuQixZQUFJQyxhQUFhQyxPQUFiLENBQXFCLFlBQXJCLENBQUosRUFBd0M7QUFDcEMsZ0JBQU1DLE9BQU9GLGFBQWFDLE9BQWIsQ0FBcUIsWUFBckIsQ0FBYjtBQUNBLGlCQUFLRSxLQUFMLEdBQWFELEtBQUtDLEtBQWxCO0FBQ0EsaUJBQUtDLElBQUwsR0FBWUYsS0FBS0UsSUFBakI7QUFDQSxpQkFBS0MsVUFBTCxHQUFrQkgsS0FBS0csVUFBdkI7QUFDQSxpQkFBS3RCLEtBQUwsR0FBYW1CLEtBQUtuQixLQUFsQjtBQUNBLGlCQUFLdUIsSUFBTCxHQUFZSixLQUFLSSxJQUFqQjtBQUNILFNBUEQsTUFPTztBQUNILGlCQUFLdkIsS0FBTCxHQUFhLENBQ1QsU0FEUyxFQUVULGVBRlMsRUFHVCxRQUhTLEVBSVQsTUFKUyxFQUtULE1BTFMsRUFNVCxNQU5TLEVBT1QsU0FQUyxFQVFULE1BUlMsQ0FBYjs7QUFXQSxpQkFBS2MsU0FBTDtBQUNIOztBQUdELGVBQU8sS0FBS1MsSUFBWjtBQUNILEtBekJEO0FBMEJIOztBQUVELFNBQVNDLElBQVQsR0FBZ0I7O0FBR1osU0FBS1IsSUFBTCxHQUFZLFlBQVcsQ0FFdEIsQ0FGRDtBQUdIOztBQUVELFNBQVNTLElBQVQsR0FBZ0I7O0FBRVosU0FBS0MsT0FBTCxHQUFlLFlBQVc7QUFDdEIsZUFBT2IsTUFBTVUsSUFBYjtBQUNILEtBRkQ7O0FBSUEsU0FBS0ksT0FBTCxHQUFlLFVBQVNKLElBQVQsRUFBZTtBQUMxQlYsY0FBTVUsSUFBTixHQUFhQSxJQUFiO0FBQ0gsS0FGRDs7QUFJQSxTQUFLUCxJQUFMLEdBQVksWUFBVztBQUNuQkgsY0FBTUcsSUFBTjtBQUNBUSxhQUFLUixJQUFMO0FBQ0gsS0FIRDtBQUlIOztBQUVELElBQU1ZLE9BQU8sSUFBSUgsSUFBSixFQUFiO0FBQ0FHLEtBQUtaLElBQUw7O0FBRUF6QixRQUFRc0IsTUFBTWIsS0FBZDs7QUFFQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDcmVhdGUgYSBsaXN0IHRoYXQgaG9sZHMgYWxsIG9mIHlvdXIgY2FyZHNcclxuICovXHJcblxyXG5cclxuLypcclxuICogRGlzcGxheSB0aGUgY2FyZHMgb24gdGhlIHBhZ2VcclxuICogICAtIHNodWZmbGUgdGhlIGxpc3Qgb2YgY2FyZHMgdXNpbmcgdGhlIHByb3ZpZGVkIFwic2h1ZmZsZVwiIG1ldGhvZCBiZWxvd1xyXG4gKiAgIC0gbG9vcCB0aHJvdWdoIGVhY2ggY2FyZCBhbmQgY3JlYXRlIGl0cyBIVE1MXHJcbiAqICAgLSBhZGQgZWFjaCBjYXJkJ3MgSFRNTCB0byB0aGUgcGFnZVxyXG4gKi9cclxuXHJcbi8vIFNodWZmbGUgZnVuY3Rpb24gZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNDUwOTc2XHJcbmZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcclxuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcclxuXHJcbiAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XHJcbiAgICAgICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xyXG4gICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xyXG4gICAgICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcclxuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xyXG4gICAgICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhcnJheTtcclxufVxyXG5cclxuXHJcblxyXG5jb25zdCBjYXJkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NhcmQnKTtcclxuXHJcbmZvciAodmFyIGNhcmQgb2YgY2FyZHMpIHtcclxuICAgIGxldCB0aGF0ID0gY2FyZFxyXG4gICAgY2FyZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGVsKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZWwpXHJcbiAgICAgICAgdGhhdC5jbGFzc0xpc3QuY29udGFpbnMoJ3Nob3cnKSA/IFxyXG4gICAgICAgICAgICB0aGF0LmNsYXNzTGlzdC5yZW1vdmUoJ3Nob3cnKSBcclxuICAgICAgICAgICAgOiB0aGF0LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcclxuICAgIH0pOyBcclxufVxyXG5cclxuXHJcblxyXG4vLyBNWSBBVFRFTVBUIHRvIG9yZGVyIHRoaXMgZ2FtZXMgY29kZS5cclxuXHJcbmZ1bmN0aW9uIE1vZGVsKCkge1xyXG5cclxuICAgIHRoaXMuYnVpbGREZWNrID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGJ1aWx0RGVjayA9IFtdXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGJ1aWx0RGVjaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKSkge1xyXG4gICAgICAgICAgICBjb25zdCBnYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2VjbU1lbUdhbWUnKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IGdhbWUubW92ZXM7XHJcbiAgICAgICAgICAgIHRoaXMudGltZSA9IGdhbWUudGltZTtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRUaW1lID0gZ2FtZS5yZWNvcmRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRzID0gZ2FtZS5jYXJkcztcclxuICAgICAgICAgICAgdGhpcy5kZWNrID0gZ2FtZS5kZWNrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FyZHMgPSBbXHJcbiAgICAgICAgICAgICAgICAnZGlhbW9uZCcsXHJcbiAgICAgICAgICAgICAgICAncGFwZXItcGxhbmUtbycsXHJcbiAgICAgICAgICAgICAgICAnYW5jaG9yJyxcclxuICAgICAgICAgICAgICAgICdib2x0JyxcclxuICAgICAgICAgICAgICAgICdjdWJlJyxcclxuICAgICAgICAgICAgICAgICdsZWFmJyxcclxuICAgICAgICAgICAgICAgICdiaWN5Y2xlJyxcclxuICAgICAgICAgICAgICAgICdib21iJ1xyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idWlsZERlY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmRlY2s7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIFZpZXcoKSB7XHJcblxyXG5cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gT2N0bygpIHtcclxuXHJcbiAgICB0aGlzLmdldERlY2sgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gTW9kZWwuZGVjaztcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldERlY2sgPSBmdW5jdGlvbihkZWNrKSB7XHJcbiAgICAgICAgTW9kZWwuZGVjayA9IGRlY2s7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgTW9kZWwuaW5pdCgpO1xyXG4gICAgICAgIFZpZXcuaW5pdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBHYW1lID0gbmV3IE9jdG87XHJcbkdhbWUuaW5pdCgpO1xyXG5cclxuc2h1ZmZsZShNb2RlbC5jYXJkcyk7XHJcblxyXG4vKlxyXG4gKiBzZXQgdXAgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciBhIGNhcmQuIElmIGEgY2FyZCBpcyBjbGlja2VkOlxyXG4gKiAgLSBkaXNwbGF5IHRoZSBjYXJkJ3Mgc3ltYm9sIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgLSBhZGQgdGhlIGNhcmQgdG8gYSAqbGlzdCogb2YgXCJvcGVuXCIgY2FyZHMgKHB1dCB0aGlzIGZ1bmN0aW9uYWxpdHkgaW4gYW5vdGhlciBmdW5jdGlvbiB0aGF0IHlvdSBjYWxsIGZyb20gdGhpcyBvbmUpXHJcbiAqICAtIGlmIHRoZSBsaXN0IGFscmVhZHkgaGFzIGFub3RoZXIgY2FyZCwgY2hlY2sgdG8gc2VlIGlmIHRoZSB0d28gY2FyZHMgbWF0Y2hcclxuICogICAgKyBpZiB0aGUgY2FyZHMgZG8gbWF0Y2gsIGxvY2sgdGhlIGNhcmRzIGluIHRoZSBvcGVuIHBvc2l0aW9uIChwdXQgdGhpcyBmdW5jdGlvbmFsaXR5IGluIGFub3RoZXIgZnVuY3Rpb24gdGhhdCB5b3UgY2FsbCBmcm9tIHRoaXMgb25lKVxyXG4gKiAgICArIGlmIHRoZSBjYXJkcyBkbyBub3QgbWF0Y2gsIHJlbW92ZSB0aGUgY2FyZHMgZnJvbSB0aGUgbGlzdCBhbmQgaGlkZSB0aGUgY2FyZCdzIHN5bWJvbCAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpbmNyZW1lbnQgdGhlIG1vdmUgY291bnRlciBhbmQgZGlzcGxheSBpdCBvbiB0aGUgcGFnZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICogICAgKyBpZiBhbGwgY2FyZHMgaGF2ZSBtYXRjaGVkLCBkaXNwbGF5IGEgbWVzc2FnZSB3aXRoIHRoZSBmaW5hbCBzY29yZSAocHV0IHRoaXMgZnVuY3Rpb25hbGl0eSBpbiBhbm90aGVyIGZ1bmN0aW9uIHRoYXQgeW91IGNhbGwgZnJvbSB0aGlzIG9uZSlcclxuICovXHJcbiJdfQ==
