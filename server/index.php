<?php
use lib\Application;
spl_autoload_register(function($class)
{
	$fileName = str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php';
	if (file_exists($fileName) && is_file($fileName)) {
		require_once $fileName;
	}
});

Application::init(array(
	Application::BASE_PATH => dirname(__FILE__) . '/application',
	Application::BASE_URL => 'http://localhost/smvc/',
));

Application::run();
