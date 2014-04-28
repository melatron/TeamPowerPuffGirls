<?php

namespace lib;

class Utils
{
	public static function getParam($key)
	{
		return self::getFromArray($_GET, $key);
	}
	
	public static function getPostParam($key)
	{
		return self::getFromArray($_POST, $key);
	}
	
	public static function getFromArray($array, $key, $default = null)
	{
		return isset($array[$key]) ? $array[$key] : null;
	}
	
	public static function parseParam($param)
	{
		$params = explode('-', $param);
		$param =  array_shift($params);
		foreach (array_map('ucfirst', $params) as $v) {
			$param .= $v;
		}
		
		return $param;
	}
	
	public static function getAsParam($str)
	{
		
		preg_match_all('/[A-Z]{0,1}[a-z]+/', $str, $matches);
		if ($matches) {
			return implode('-', array_map('strtolower', $matches[0]));
		}
		
	}
	
	public static function debug($data, $die = false, $pre = true)
	{
		 echo $pre ? '<pre>' : '' ;
		 var_dump($data);
		 echo $pre ? '</pre>' : '' ;
		 
		 $die && die;
	}
}