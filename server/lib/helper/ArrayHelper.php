<?php
namespace lib\helper;

class ArrayHelper
{
	public static function getFromArray($array, $key, $default = null)
	{
		return isset($array[$key]) ? $array[$key] : null;
	}
}