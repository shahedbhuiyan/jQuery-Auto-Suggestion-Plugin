<?php
	$host = "localhost";
	$user = "root";
	$pass = "blackmagic";
	$db = "masamad";

	$conn = mysql_connect($host, $user, $pass) or die("Connection Failed!");
	mysql_select_db($db, $conn) or die("Database couldn't select!");

	$action = isset($_POST["action"]) ? $_POST["action"] : "";

	if($action == 'test'){
		$sql = "select * from drug_list";
		$rec = mysql_query($sql);
		$drg_ary = array();
		
		$data = "[";
		while($row = mysql_fetch_array($rec)){
			$id = $row['id'];
			$drug = $row['brand'];
			$mg = $row['mg'];
			
			$drug = $drug." ".$mg;;
			
			$data .= "{\"id\":\"$id\",\"txt\":\"$drug\"},";
		}
		
		$data = trim($data,",");
		$data .= "]";
		
		echo $data;
	}