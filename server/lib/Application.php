<?php

namespace lib;

use lib\helper\ArrayHelper;

class Application
{
	const BASE_URL = 'base_url';
	const BASE_PATH = 'base_path';
	const DB_SETTINGS = 'db_settings';
	
	protected static $config = array();
	
	protected static $controller;
	
	protected static $action;
	
	public static function init($config = array())
	{
		if (!self::isCli()) {
			session_start();
		}
		self::$config = (array)$config;
	//	self::initAutoloading();
	}
	
	public static function getSetting($setting)
	{
		return empty(self::$config[$setting]) ? null : self::$config[$setting];
	}
	
	protected static function initAutoloading()
	{ 
		spl_autoload_register(array(new Loader(
				array( 
					Utils::getFromArray(self::$config, self::INCLUDE_PATH),
					Utils::getFromArray(self::$config, self::BASE_PATH)
				)), 
		'loadClass'));
	}
	
	
	public static function run()
	{
		if (self::isCli()) {
			if (!isset($_SERVER['argv'][2])) {
				die('Please provide 1-st argument route in format <console task>/<action>' . PHP_EOL);
			}
			$controllerPrefix = 'console\\';
			$route = explode('/', Utils::getFromArray($_SERVER['argv'], 2));
		} else {
			$route = explode('/', (Utils::getParam('route') ? Utils::getParam('route') : 'index/index'));
			$controllerPrefix = 'controller\\';
		}

		self::$controller = Utils::parseParam(array_shift($route));
		$controllerName = 'application\\' . $controllerPrefix . ucfirst(self::$controller);
		
		self::$action = Utils::parseParam(array_shift($route));
		self::$action  = self::$action ? self::$action : 'index';
		$actionName = 'action' . ucfirst(self::$action);
		
		if (!class_exists($controllerName)) {
			$controllerInstance = new Controller();
			return $controllerInstance->notFound();
		}
			
		$controllerInstance = new $controllerName;
		if (method_exists($controllerInstance, 'beforeAction')) {
			call_user_func_array(array($controllerInstance , 'beforeAction'), array(self::$action));
		}
		$get = $_GET;
		if (isset($get['route'])) 
			unset($get['route']);
		if (method_exists($controllerInstance, 'before' . ucfirst(self::$action))) {
			call_user_func_array(array($controllerInstance , 'before' . ucfirst(self::$action)), $get);
		}
		
		if (method_exists($controllerInstance, $actionName)) {
			call_user_func_array(array($controllerInstance , $actionName), $get);
		} elseif (method_exists($controllerInstance, 'notFound')) {
			call_user_func_array(array($controllerInstance , $actionName), $get);
		} else {
			throw new Exception('Action not found');
		}
		
		if (method_exists($controllerInstance, 'after' . ucfirst(self::$action))) {
			call_user_func_array(array($controllerInstance , 'after' . ucfirst(self::$action)), $get);
		}
	}
	
	public static function getUrl($params = array(), $script = 'index.php')
	{
		$controller = 'index';
		if (!empty($params['controller'])) {
			$controller = Utils::getAsParam($params['controller']);
			unset($params['controller']);
		}
		
		$action = 'index';
		if (!empty($params['action'])) {
			$action = Utils::getAsParam($params['action']);
			unset($params['action']);
		}
		
		$params['route'] = $controller . '/' . $action;
		return Utils::getFromArray(self::$config, self::BASE_URL) . $script . '?' . http_build_query($params);
	}
	
	public static function getResourseUrl($r)
	{
		return self::getSetting(self::BASE_URL) .'public/' . $r;
	}
	
	public static function isCli()
	{
		return !empty($_SERVER['argv'][1]) && $_SERVER['argv'][1] === 'cli';
	}
	
	public static function getController()
	{
		return self::$controller;
	}
	
	public static function getAction()
	{
		return self::$action;
	}
	
	public static function getBasePath()
	{
		return ArrayHelper::getFromArray(self::$config, self::BASE_PATH, realpath(dirname(__FILE__) . '/../application'));
	}
	
	public static function test()
	{
		var_dump(realpath(dirname(__FILE__) . '/../'));
	}
	
	public static function end()
	{
		die();
	}
}