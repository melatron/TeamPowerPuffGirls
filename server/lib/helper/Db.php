<?php
namespace lib\helper;

class Db
{
	
	protected static $transactionLevel = 0;
	
	protected static $connection = array();

	/**
	 * 
	 * @param string $name
	 * @return PDO
	 */
	public static function getConnection($name = 'default')
	{
		if (!isset(self::$connection[$name]))
			self::connect($name);

		return self::$connection[$name];
	}

	protected static function connect($name)
	{
		list($dsn, $username, $passwd, $options) = 
			array_values(Utils::getFromArray(Application::getSetting(Application::DB_SETTINGS), $name));
		self::$connection[$name] = new PDO($dsn, $username, $passwd, $options);
		
		self::$connection[$name]->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	
	public static function fetchRow($table, $pk, $pkName = 'id', $connection = 'default')
	{
		$sth = self::getConnection($connection)->prepare(sprintf('SELECT * FROM %s WHERE %s = ?', $table, $pkName));
		$sth->execute(array($pk));
		return $sth->fetch(PDO::FETCH_ASSOC);
	}
	
	public static function update($table, $pk, $pkName, $bind, $connection = 'default')
	{
		$fields = array();
		foreach (array_keys($bind) as $f) {
			$fields[] = $f . ' = ?';
		}
		$params = array_values($bind);
		$pk = is_array($pk) ? $pk :  array($pk);
		$pkName = is_array($pkName) ? $pkName :  array($pkName);
		$pkCondition = array();
		foreach ($pkName as $n) {
			$pkCondition[] = ($n . ' =? ');
		}
		
		
		$params = array_merge($params, array_values($pk));
		$sth = self::getConnection($connection)->prepare(sprintf('UPDATE %s SET %s WHERE %s', $table, implode(',', $fields), implode(' AND ', $pkCondition)));
		$sth->execute($params);
		return $sth->rowCount();
	}
	
	public static function getDateTime($ts = null)
	{
		return date('Y-m-d H:i:s', $ts ? $ts : time());
	}
	
	public static function delete($table , $condition, $bind = array(), $connection = 'default')
	{
		$sth = self::getConnection($connection)->prepare(sprintf('DELETE FROM %s WHERE ', $table) . $condition);
		$sth->execute($bind);
		return $sth->rowCount();
	}
	

	public static function query($query, $bind = array(), $connection = 'default')
	{
		$sth = self::getConnection($connection)->prepare($query);
		$sth->execute($bind);
		
		if (stripos($query, 'select') === 0) {
			return $sth->fetchAll(PDO::FETCH_ASSOC);
		}
		
		return $sth->rowCount();
	}
	
	public static function fetchAll($query, $bind = array(), $connection = 'default')
	{
		$sth = self::getConnection($connection)->prepare($query);
		$sth->execute($bind);
		
		return $sth->fetchAll(PDO::FETCH_ASSOC);
	}
	
	public static function fetchCol($table, $where = null, $bind = array(), $colName = null, $connection = 'default')
	{
		$sql = 'SELECT ' . ($colName ? $colName : '*') . ' FROM ' . $table;
		$where ? $sql .= ' WHERE ' . $where : null;

		$sth = self::getConnection($connection)->prepare($sql);
		$sth->execute($bind);
		
		return $sth->fetchColumn(0);
	}
	
	public static function fetchOne($sql, $bind = array(), $connection = 'default')
	{
		$sth = self::getConnection($connection)->prepare($sql);
		$sth->execute($bind);
		
		return $sth->fetchColumn();
	}
	
	public static function fetchFirst($query, $bind = array(), $connection = 'default')
	{
		$result = Db::query($query, $bind, $connection);
		if (is_array($result)) {
			return current($result);
		}
	}
	
	public static function insert($table, $row, $connection = 'default')
	{
		$sql = 'INSERT INTO ' . $table . ' (' . implode(',', array_keys($row)) .') VALUES (' .  implode(',', array_fill(1, count($row), '?')) . ')';
		$sth = self::getConnection($connection)->prepare($sql);
		$sth->execute(array_values($row));
		
		return self::getConnection($connection)->lastInsertId();
	}

	public static function startTransaction()
	{
		if (!self::$transactionLevel++)
			self::query('START TRANSACTION');
	}
	
	public static function rollback()
	{
		self::$transactionLevel && --self::$transactionLevel;
		if(!self::$transactionLevel) {
			self::query('ROLLBACK');
		}
	}
	
	public static function commit()
	{
		self::$transactionLevel && --self::$transactionLevel;
		if(!self::$transactionLevel) {
			self::query('COMMIT');
		}
	}
}