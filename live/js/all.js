"use strict";var Model={createCard:function(e){var t=document.createElement("li"),i=document.createElement("img");return t.subEl=document.createElement("i"),i.src="images/geometry2.png",i.alt="Invisible image used to keep items square",t.card=e,t.match=!1,t.cardShow=!1,t.className="card",t.dataset.item=e,t.subEl.className="fa fa-"+e,t.appendChild(t.subEl),t.appendChild(i),t},shuffle:function(e){for(var t,i,s=e.length;0!==s;)i=Math.floor(Math.random()*s),t=e[s-=1],e[s]=e[i],e[i]=t;return e},buildDeck:function(){var e=[],t=!0,i=!1,s=void 0;try{for(var n,a=this.cards[Symbol.iterator]();!(t=(n=a.next()).done);t=!0){var r=n.value;e.push(this.createCard(r)),e.push(this.createCard(r))}}catch(e){i=!0,s=e}finally{try{!t&&a.return&&a.return()}finally{if(i)throw s}}this.deck=this.shuffle(e)},init:function(){if(localStorage.getItem("ecmMemGame")){var e=localStorage.getItem("ecmMemGame");this.moves=e.moves,this.lives=e.lives,this.time=e.time,this.recordTime=e.recordTime,this.cards=e.cards,this.deck=e.deck,this.activeCard=e.activeCard,this.numMatched=e.numMatched}else this.cards=["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"],this.moves=0,this.lives=3,this.time={start:!1,hr:0,min:0,sec:0,tiny:0},this.recordTime=0,this.numMatched=0,this.activeCard=[null],this.buildDeck()}},View={gameStart:!1,updateTime:function(e){var t=e.min<10?"0"+e.min:e.min,i=e.sec<10?"0"+e.sec:e.sec,s=e.tiny<10?"0"+e.tiny:e.tiny;document.getElementsByClassName("timer")[0].innerHTML=t+":"+i+"."+s},hideWin:function(){document.getElementById("winning").className="display-none"},showWin:function(){document.getElementById("winning").classList.add("show")},loseStar:function(e){this.stars[e].remove()},changeMoves:function(e){document.getElementsByClassName("moves")[0].innerHTML=e},hideCards:function(){for(var e=arguments.length,t=Array(e),i=0;i<e;i++)t[i]=arguments[i];var s=!0,n=!1,a=void 0;try{for(var r,c=t[Symbol.iterator]();!(s=(r=c.next()).done);s=!0){var o=r.value;o.cardShow=!1,o.classList.remove("show"),o.classList.remove("wrong"),o.classList.remove("match")}}catch(e){n=!0,a=e}finally{try{!s&&c.return&&c.return()}finally{if(n)throw a}}},wrongCards:function(e,t){e.classList.add("wrong"),t.classList.add("wrong")},setMatched:function(e,t){e.classList.add("match"),e.match=!0,t.classList.add("match"),t.match=!0,Octo.resetActiveCard()},init:function(){this.stars=[],this.gameStart||(this.theDeck=document.getElementsByClassName("deck")[0],this.resetButton=document.getElementById("restart"),this.resetButton.addEventListener("click",function(){Octo.reset()})),this.theDeck.innerHTML="";var e=!(this.wrongSet=!1),t=!1,i=void 0;try{for(var s,n=Octo.getDeck()[Symbol.iterator]();!(e=(s=n.next()).done);e=!0){var a=s.value;a.addEventListener("click",function(e){var t=e.currentTarget;Octo.cardCheck(t)}),this.theDeck.appendChild(a)}}catch(e){t=!0,i=e}finally{try{!e&&n.return&&n.return()}finally{if(t)throw i}}var r=document.getElementsByClassName("stars")[0];r.innerHTML="";for(var c=0;c<Octo.getLives();c++){var o=document.createElement("li"),d=document.createElement("i");d.className="fa fa-star",o.appendChild(d),r.appendChild(o),this.stars.push(o)}this.hideWin(),document.getElementsByClassName("moves")[0].innerHTML=Octo.getMoves(),this.gameStart=!0}},Octo={winGame:function(){View.showWin(),Model.time.start=!1},resetMoves:function(){Model.moves=0},getMoves:function(){return Model.moves},getLives:function(){return Model.lives},updateLives:function(){Model.moves<20?Model.lives=3:(Model.moves<29?Model.lives=2:Model.lives=1,View.loseStar(Model.lives))},updateMoves:function(){Model.moves++,View.changeMoves(Model.moves)},resetActiveCard:function(){Model.activeCard=[]},setActiveCard:function(e,t){Model.activeCard=t?[e,t]:[e]},getActiveCard:function(){return Model.activeCard},getDeck:function(){return Model.deck},setDeck:function(e){Model.deck=e},resetDeck:function(){Model.buildDeck()},setWrong:function(e,t){View.wrongSet=!0,View.wrongCards(e,t),setTimeout(function(){View.hideCards(e,t),Octo.resetActiveCard(),View.wrongSet=!1},1300)},matched:function(e,t){View.setMatched(e,t),Model.numMatched++,Model.numMatched==Model.cards.length&&this.winGame()},cardCheck:function(e){var t=this.getActiveCard();Model.time.start||this.startTimer(Model.time),e.match||!this.getLives()||View.wrongSet||(this.updateMoves(),this.updateLives(),e.cardShow?(View.hideCards(e),this.setActiveCard(null)):t.length<2&&(e.cardShow=!0,e.classList.add("show"),t[0]?(this.setActiveCard(t[0],e),e.card===t[0].card?this.matched(e,t[0]):this.setWrong(e,t[0])):this.setActiveCard(e)))},startTimer:function(t){Model.time.start=!0,setTimeout(function e(){Model.time.start&&(t.tiny++,100===t.tiny&&(t.tiny=0,t.sec++,60===t.sec&&(t.sec=0,t.min++)),View.updateTime(t),setTimeout(e,10))},10)},reset:function(){this.resetMoves(),this.resetDeck(),this.resetActiveCard(),Model.time.start=!1,Model.time.min=0,Model.time.sec=0,Model.time.tiny=0,View.updateTime(Model.time),View.init()},init:function(){Model.init(),View.init()}};Octo.init();