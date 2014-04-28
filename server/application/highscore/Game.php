<?php
/**
 * Created by PhpStorm.
 * User: vasil
 * Date: 4/17/14
 * Time: 11:58 AM
 */

namespace application\highscore;


use lib\Application;
use lib\helper\ArrayHelper;

class Game
{
    const MAX_HIGH_SCORES = 100;

    private static $_games =  [
        'c4ca4238a0b923820dcc509a6f75849b' => [
            'title' => 'Planes Game',
        ],
        'c81e728d9d4c2f636f067f89cc14862c' => [
            'title' => 'Quest game',
        ],
        'eccbc87e4b5ce2fe28308fd9f2a7baf3' => [
            'title' => 'Shooter',
        ],
        'a87ff679a2f3e71d9181a67b7542122c' => [
            'title' => 'Street Fighter',
        ],
    ];

    public static function isValidGame($id)
    {
        return isset(self::$_games[$id]);
    }

    public static function isHighScore($gameId, $score)
    {
        $all = self::readHighScore($gameId);
        $cnt = count($all);
        if (!$cnt) {
            return [true, 0];
        }

        foreach ($all as $k => $v) {
            if ($v['score'] < $score) {
                return [true, $k];
            }
        }

        if ($cnt < self::MAX_HIGH_SCORES) {
            return [true, $cnt];
        }

        return [false, null];
    }

    public static function saveHighScore($gameId, $score, $player, $position)
    {
        $row = [
          'score' => $score,
          'player' => $player,
          'time' => time()
        ];
        $all = self::readHighScore($gameId);
        $cnt = count($all);
        $tmp = null;
        for ($i = $position; $i <= $cnt; $i++) {
            $c = ArrayHelper::getFromArray($all, $i);
            if ($tmp) {
                $all[$i] = $tmp;
            }

            $tmp = ArrayHelper::getFromArray($all, $i + 1);

            if($c) {
                $all[$i + 1] = $c;
            }
        }
        $all[$position] = $row;

        if (count($all) > self::MAX_HIGH_SCORES) {
            array_pop($all);
        }


        $all[$position] = $row;
        self::saveData($gameId, $all);

    }

    public static function readHighScore($gameId)
    {
        $score = [];

        if (($file = self::getGameFile($gameId)) !== false) {
            $score = @json_decode(file_get_contents($file), JSON_OBJECT_AS_ARRAY);
            if (!$score) {
                $score = [];
            }
        }

        return $score;
    }

    private static function getGameFile($gameId)
    {

        $fullPath = self::getGameFileName($gameId);

        if (file_exists($fullPath) && is_file($fullPath) && is_readable($fullPath)) {
            return $fullPath;
        }

        return false;
    }

    private static function getGameFileName($gameId)
    {
        $file = $gameId . '.game';
        $path = realpath(Application::getBasePath() . '/runtime');

        return $path . DIRECTORY_SEPARATOR . $file;
    }

    private static function saveData($gameId, $rows)
    {
        $score = [];
        foreach($rows as $r)
            $score[] = $r['score'];

        array_multisort($rows, $score);
        $rows = array_reverse($rows);
        file_put_contents(self::getGameFileName($gameId), json_encode($rows));
    }
}