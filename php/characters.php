<?php

require_once __DIR__ . '/Class/Response.php';

define( 'CHARACTERS', [
  'ariel',
  'liza',
  'mike',
  'computer'
]);

Response::ok(CHARACTERS);