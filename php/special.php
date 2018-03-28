<?php

require_once __DIR__ . '/Class/Game.php';
require_once __DIR__ . '/Class/Player.php';
require_once __DIR__ . '/Class/Response.php';
session_start();

$player = $_GET['player'];
$_SESSION['game']->$player->useSpecial();

Response::ok($_SESSION['game']);