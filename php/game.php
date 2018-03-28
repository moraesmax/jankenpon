<?php

require_once __DIR__ . '/Class/Game.php';
require_once __DIR__ . '/Class/Player.php';
require_once __DIR__ . '/Class/Response.php';
session_start();


$method  = $_SERVER['REQUEST_METHOD'];

switch ( $method ) {
  case 'GET':
    getCurrentGame();
    break;
  case 'POST':
    createNewGame( $_POST['characterId'] );  
    break;
  case 'DELETE':
    deleteSavedGame();  
    break;
  case 'PUT':
    makeMove( $_GET['move'] );
    break;
}


function getCurrentGame() {
  Response::ok( ( $_SESSION['game'] ) ? $_SESSION['game'] : null);
}

function createNewGame( $characterId ) {
  $game             = new Game( $characterId, "computer" );
  $_SESSION['game'] = $game;
  Response::ok( $game );
}

function deleteSavedGame() {
  session_destroy();
  Response::ok();
}

function makeMove( $move ) {
  $game          = $_SESSION['game'];
  $playerOneMove = $move;
  $playerTwoMove = $game->getRandomMove();
  $winner        = 0;
  if( $playerOneMove == $playerTwoMove ) {
    $winner = 0;
  } else if( $game->playerOne->winsMove( $playerOneMove, $playerTwoMove, $game->moves ) ) {
    $winner = 1;
    $game->playerOne->hit();
    $game->playerTwo->takeHit();
  } else {
    $winner = 2;
    $game->playerOne->takeHit();
    $game->playerTwo->hit();
  }
  $game->playerOne->lastMovePlayed = $playerOneMove;
  $game->playerTwo->lastMovePlayed = $playerTwoMove;
  $game->finishRound($winner);
  $_SESSION['game'] = $game;
  Response::ok($game);
}