<?php

require_once __DIR__ . '/Player.php';
session_start();

class Game {
  public $round;
  public $playerOne;
  public $playerTwo;
  public $moves;
  public $lastRoundWinner;

  public function __construct( $playerOne, $playerTwo ) {
    $this->round     = 1;
    $this->playerOne = new Player( $playerOne );
    $this->playerTwo = new Player( $playerTwo );
    $this->moves     = [
      'rock' => [
        'icon'     => 'rock',
        'winsOver' => [
          'scissors',
          'lizard'
        ]
      ],
      'paper' => [
        'icon'     => 'paper',
        'winsOver' => [
          'rock',
          'spock'
        ]
      ],
      'scissors' => [
        'icon'     => 'scissors',
        'winsOver' => [
          'paper',
          'lizard'
        ]
      ],
      'lizard' => [
        'icon'     => 'lizard',
        'winsOver' => [
          'spock',
          'paper'
        ]
      ],
      'spock' => [
        'icon'     => 'spock',
        'winsOver' => [
          'rock',
          'scissors'
        ]
      ],
    ];
  }

  function getRandomMove() {
    return array_rand($this->moves);
  }

  function finishRound($winner) {
    ++$this->round;
    $this->lastRoundWinner = $winner;
  }

}