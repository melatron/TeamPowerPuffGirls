<?php
if($_GET){
    header("Content-type: application/json");
    $fileName=$_GET["fileName"];
    $host = "localhost";
    $username = "root";
    $password = "";
    $dbname = "powerpaffproject";

    $db = mysqli_connect($host, $username, $password, $dbname);

    if(mysqli_connect_errno())
    {
        header("HTTP/1.0 404 Not Found");
    }
    else{
        $query = "SELECT * FROM quest_dialogs WHERE quest_name='".$fileName."'";
        $result = mysqli_query($db, $query);

        $total_num_rows = mysqli_num_rows($result);

        $row = mysqli_fetch_array($result);
        echo json_encode($row);
    }
}else{
    echo "DON'T FUCK WITH ME NO GET DATA HERE BITCH";
}
