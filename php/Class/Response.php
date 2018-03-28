<?php

class Response {
  function ok( $data = null ) {
    header('Content-type: application/json');
    echo json_encode($data);
  }
}