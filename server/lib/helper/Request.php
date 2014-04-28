<?php
namespace lib\helper;

class Request
{
	public static function isAjax()
	{
		$headers = getallheaders();
		if (isset($headers['X-Requested-With']) && strtolower($headers['X-Requested-With']) == 'xmlhttprequest') {
			return true;
		}
	}
	
	public static function getParam($key)
	{
		return ArrayHelper::getFromArray($_GET, $key);
	}
	
	public static function getPostParam($key)
	{
		return ArrayHelper::getFromArray($_POST, $key);
	}
	
}