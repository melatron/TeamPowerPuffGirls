<?php
if($_GET){
    $fileName=$_GET["fileName"];
    //if(file_exist($fileName)){
     $ultimateText=  file_get_contents("Dialogs/".$fileName.".txt");
        //echo $fileName;
        echo $ultimateText;
   // }
   // else{
   //     echo "NO FUCKIN' FILE NOOB";
   // }
}else{
    echo "DON'T FUCK WITH ME NO GET DATA HERE BITCH";
}
