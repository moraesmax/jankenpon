var game;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$( document ).ready( function() {
  game = {
    playBackgroundMusic : function() {
      $( '.js-background-theme' )[0].play();
    },
    pauseBackgroundMusic : function() {
      $( '.js-background-theme' )[0].pause();
    },
    startGameIntro : function() {
      $.get( "php/game.php", function( savedGame ) {
        if( savedGame !== null ) {
          $( ".js-continue-game" ).removeClass( "off" );
          $( ".js-continue-game" ).click( function() {
            $.get( "php/game.php", function(gameData) {
              game.renderBattleArena( gameData );
            });
          });
        }

        $( ".js-new-game" ).click( function() {
          $( ".js-start-menu" ).slideUp( "slow", function() {
            $( ".js-choose-character" ).slideDown( "slow" );
          });
        });

        $( ".js-back-to-start-menu" ).click( function() {
          $( ".js-choose-character" ).slideUp( "slow", function() {
            $( ".js-start-menu" ).slideDown( "slow" );
          });
        });

        $.get( "php/characters.php", function( characterList ){
          characterList.forEach( function( character ) {
            var templateCharacter = $.parseHTML( $(".js-template-character").html() );
            $( templateCharacter ).find( "img" ).attr( "src", "res/img/characters/" + character + ".png" ); 
            $( templateCharacter ).find( "img" ).attr( "alt", capitalizeFirstLetter( character ) ); 
            $( templateCharacter ).find( "span" ).html( capitalizeFirstLetter( character ) ); 
            $( templateCharacter ).attr( "data-character", character ); 
            $( ".js-character-list" ).append( templateCharacter );
          });
          $( ".js-select-character" ).click( function() {
            game.startGame( $(this).attr( "data-character" ) );
          });
          $( ".js-start-menu" ).slideDown( "slow" );
        });
      });
    },
    startGame : function( character ) {
      $.post( "php/game.php", { characterId: character } )
      .done( function( gameData ) {
        game.renderBattleArena( gameData );
      });
    },
    renderBattleArena : function( gameData ) {
      
      game.renderBattleArenaHeader( gameData );
      game.renderBattleArenaFooter( gameData );

      $( ".js-intro" ).slideUp( "slow", function() {
        $( ".js-battle" ).slideDown( "slow" , function() {
          if(gameData.playerOne.name == "Computer") {
            $( document ).on( "readyToAction", function() {
              var possibleMoves = [];
              for (var move in gameData.moves) {
                    possibleMoves.push(move);
              }
              setTimeout(function() {
                var move = possibleMoves[ Math.floor( Math.random() * possibleMoves.length ) ];
                game.makeMove(possibleMoves[ possibleMoves.length * Math.random() << 0 ] );
              }, 1000);
            });
            $( document ).trigger( "readyToAction" );
          } else {
            $( ".js-move" ).click( function() {
              game.makeMove($( this ).attr( "data-icon" ));
            });
          }
        });
      });

    },
    updateBattleArena : function( gameData ) {
      game.renderBattleArenaHeader( gameData );
    },
    renderBattleArenaHeader : function( gameData ) {
      
      console.log("updating header data");
      
      $( ".js-player-one .profile img" ).attr( "src", "res/img/characters/" + gameData.playerOne.icon );
      $( ".js-player-one .profile img" ).attr( "alt", gameData.playerOne.name );

      $( ".js-player-two .profile img" ).attr( "src", "res/img/characters/" + gameData.playerTwo.icon );
      $( ".js-player-two .profile img" ).attr( "alt", gameData.playerTwo.name );
      
      $( ".js-player-one .js-hp-bar" ).css( "width", gameData.playerOne.healthPoints + "%" );
      $( ".js-player-one .js-hp-value" ).html( gameData.playerOne.healthPoints + "/100" );
      $( ".js-player-one .js-special-bar" ).css( "width", gameData.playerOne.specialPoints + "%" );
      $( ".js-player-one .js-special-value" ).html( gameData.playerOne.specialPoints + "/100" );

      $( ".js-player-two .js-hp-bar" ).css( "width", gameData.playerTwo.healthPoints + "%" );
      $( ".js-player-two .js-hp-value" ).html( gameData.playerTwo.healthPoints + "/100" );
      $( ".js-player-two .js-special-bar" ).css( "width", gameData.playerTwo.specialPoints + "%" );
      $( ".js-player-two .js-special-value" ).html( gameData.playerTwo.specialPoints + "/100" );

      $( ".js-rounds h3" ).html( gameData.round + "<br><small>round</small>" );
      
      console.log("ready to action!");  

      $( document ).trigger( "readyToAction" );
      
    },
    renderBattleArenaFooter : function( gameData ) {
      for (var move in gameData.moves) {
        var templateMove = $.parseHTML( $(".js-template-move").html() );
        $( templateMove ).attr( "data-icon", gameData.moves[move].icon );
        $( templateMove ).find( "i" ).removeClass().addClass( "far fa-hand-" + gameData.moves[move].icon );
        $( ".js-move-list" ).append( templateMove );
      }
    },
    showMsg : function ( msg ) {
      $( ".js-msg-text" ).html( msg );
      $( ".js-msg" ).fadeIn();
    },
    hideMsg : function () {
      $( ".js-msg ").fadeOut();
    },
    makeMove : function(move) {
      console.log("making move: " + move);
      $.ajax({
        method: "PUT",
        url: "php/game.php?move=" + move,
      })
        .done( function( gameData ) {
          console.log("finished move: " + move);
          $( "main .left i" ).one(
            'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
            function() {
              console.log("finished hand animation");
              $( "main .left i" ).removeClass().addClass("far fa-hand-" + gameData.playerOne.lastMovePlayed);
              $( "main .right i" ).removeClass().addClass("far fa-hand-" + gameData.playerTwo.lastMovePlayed);

              if( gameData.lastRoundWinner > 0) {
                console.log("someone win the round");
                setTimeout( function() {
                  if( gameData.playerOne.specialPoints === 100 || gameData.playerTwo.specialPoints === 100 ) {
                    console.log("someone will use special");
                    var msgPlayer = ( gameData.playerOne.specialPoints === 100 ) ? "Player One" : "Player Two";
                    var requestPlayer = ( gameData.playerOne.specialPoints === 100 ) ? "playerOne" : "playerTwo";
                    game.showMsg( msgPlayer + " Special Time!!!!" ); 
                    $.get( "php/special.php?player=" + requestPlayer, function( gameData ) {
                      console.log("someone used special");
                      setTimeout( function() {
                        game.hideMsg();
                        game.updateBattleArena( gameData );
                      }, 2000);
                    });
                    return true;
                  } if( gameData.playerOne.healthPoints === 0 || gameData.playerTwo.healthPoints === 0) {
                    console.log("We have a winner !!");
                    var msgPlayer = ( gameData.playerOne.healthPoints === 0 ) ? "Player Two" : "Player One";
                    game.showMsg( msgPlayer + " Wins!!!!" ); 
                    $.ajax({
                      method: "DELETE",
                      url: "php/game.php",
                    })
                    .done( function() {
                      setTimeout( function() {
                        location.reload();
                      }, 4000);
                    });
                    return true;                    
                  } else {
                    setTimeout( function() {
                      game.updateBattleArena(gameData);
                    }, 1000);

                    var winnerSelector = ( gameData.lastRoundWinner === 1 ) ? ".left" : ".right";
                    $( "main " + winnerSelector ).addClass( "winner" );
                    $( "main " + winnerSelector ).one(
                      'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
                      function() {
                        $( this ).removeClass( "winner" );
                        console.log("finished winner animation");
                      }
                    );
                  }
                }, 500);
              } else {
                console.log("Tie");
                var timeout = (gameData.playerOne == "Computer") ? 1500 : 0;
                setTimeout(function() {
                  game.updateBattleArena( gameData );
                }, timeout);
              }
            }
          );
          
          $( "main .left i" ).removeClass().addClass( "shaking far fa-hand-rock" );
          $( "main .right i" ).removeClass().addClass( "shaking far fa-hand-rock" );

          
        });
    }
  };
  game.startGameIntro();
  game.playBackgroundMusic();
});