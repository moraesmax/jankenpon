<?php

define( 'FULL_HEALTH',     100 );
define( 'FULL_SPECIAL',    100 );
define( 'HEALTH_DECREASE',  25 );
define( 'HEALTH_INCREASE',  50 );
define( 'SPECIAL_INCREASE', 35 );

class Player {
  public $name;
  public $icon;
  public $healthPoints;
  public $specialPoints;
  public $lastMovePlayed;

  public function __construct( $id ) {
    $this->name          = ucfirst( $id );
    $this->icon          = $id . '.png';
    $this->healthPoints  = FULL_HEALTH;
    $this->specialPoints = 0;
  }

  public function takeHit() {
    $this->healthPoints  = ( $this->healthPoints < HEALTH_DECREASE) ? 0 : ( $this->healthPoints - HEALTH_DECREASE );
    $this->specialPoints = ( ( $this->specialPoints + SPECIAL_INCREASE ) >= FULL_SPECIAL ) ? FULL_SPECIAL : ( $this->specialPoints + SPECIAL_INCREASE );
  }

  public function hit() {
  }

  public function useSpecial() {
    $this->specialPoints = 0;
    $this->healthPoints  = ( ( $this->healthPoints + HEALTH_INCREASE ) >= FULL_HEALTH ) ? FULL_HEALTH : ( $this->healthPoints + HEALTH_INCREASE );
  }

  public function winsMove( $move, $against, $possibleMoves ) {
    return in_array( $against, $possibleMoves[$move]['winsOver'] );
  }
}