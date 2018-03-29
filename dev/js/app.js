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

      $( ".js-move" ).click( function() {
        $.ajax({
          method: "PUT",
          url: "php/game.php?move=" + $( this ).attr( "data-icon" ),
        })
          .done( function( gameData ) {

            $( "main .left i" ).one(
              'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
              function() {
                $( this ).removeClass().addClass("far fa-hand-" + gameData.playerOne.lastMovePlayed);
                if( gameData.lastRoundWinner === 1 ) {
                  setTimeout( function() {
                    game.updateBattleArena( gameData );

                    if( gameData.playerTwo.specialPoints === 100 ) {
                      game.showMsg( "Player Two Special Time!!!!" ); 
                      $.get( "php/special.php?player=playerTwo", function( gameData ) {
                        setTimeout( function() {
                          game.hideMsg();
                        }, 2000);
                        game.updateBattleArena( gameData );
                      });
                    }

                    if( gameData.playerTwo.healthPoints === 0 ) {
                      game.showMsg( "Player One Wins!!!!" ); 
                      $.ajax({
                        method: "DELETE",
                        url: "php/game.php",
                      })
                      .done( function() {
                        setTimeout( function() {
                          location.reload();
                        }, 4000);
                      });
                    }

                    $( "main .left" ).addClass( "winner" );
                    $( "main .left" ).one(
                      'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
                      function() {
                        $( this ).removeClass( "winner" );
                      }
                    );
                  }, 500);
                }
              }
            );

            $( "main .right i" ).one(
              'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
              function() {
                $( this ).removeClass().addClass("far fa-hand-" + gameData.playerTwo.lastMovePlayed);
                if( gameData.lastRoundWinner === 2 ) {
                  setTimeout( function() {
                    game.updateBattleArena( gameData );

                    if( gameData.playerOne.specialPoints === 100 ) {
                      game.showMsg( "Player One Special Time!!!!" ); 
                      $.get( "php/special.php?player=playerOne", function( gameData ) {
                        setTimeout( function() {
                          game.hideMsg();
                        }, 2000);
                        game.updateBattleArena( gameData );
                      });
                    }

                    if( gameData.playerOne.healthPoints === 0 ) {
                      game.showMsg( "Player Two Wins!!!!" ); 
                      $.ajax({
                        method: "DELETE",
                        url: "php/game.php",
                      })
                      .done( function() {
                        setTimeout( function() {
                          location.reload();
                        }, 4000);
                      });
                    }

                    $( "main .right" ).addClass( "winner" );
                    $( "main .right" ).one(
                      'webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', 
                      function() {
                        $( this ).removeClass( "winner" );
                      }
                    );
                  }, 500);
                }
              }
            );
            
            $( "main .left i" ).removeClass().addClass( "shaking far fa-hand-rock" );
            $( "main .right i" ).removeClass().addClass( "shaking far fa-hand-rock" );


          });
      });

      $( ".js-intro" ).slideUp( "slow", function() {
        $( ".js-battle" ).slideDown( "slow" );
      });

    },
    updateBattleArena : function( gameData ) {
      game.renderBattleArenaHeader( gameData );
    },
    renderBattleArenaHeader : function( gameData ) {
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
    }
  };
  game.startGameIntro();
  game.playBackgroundMusic();
});