<?php
/**
 * Created by PhpStorm.
 * User: vasil
 * Date: 4/17/14
 * Time: 11:47 AM
 */


namespace application\controller;

use \application\highscore\Game;
use lib\Controller;
use lib\helper\ArrayHelper;

class HighScore extends Controller
{
    private $gameId;

    const RESULT_ERROR = 'error';
    const RESULT_SUCCESS = 'success';

    public function beforeAction()
    {
        $this->gameId = ArrayHelper::getFromArray($_GET, 'gameId');
        if (!$this->gameId || !Game::isValidGame($this->gameId)) {
            die(json_encode([
                'result' => self::RESULT_ERROR,
                'errors' => ['Invalid game id']
            ]));
        }
    }

    public function actionIsHighScore()
    {
        $score = ArrayHelper::getFromArray($_GET, 'score');
        $score = abs($score);
        if (!$score) {
            die(json_encode([
                'result' => self::RESULT_ERROR,
                'errors' => ['Can\'t check empty score!']
            ]));
        }

        list($isHighScore, $position) = Game::isHighScore($this->gameId, $score);

        die(json_encode([
            'result' => self::RESULT_SUCCESS,
            'data' => $isHighScore
        ]));

    }

    public function actionGetHighScore()
    {
        $limit = ArrayHelper::getFromArray($_GET, 'limit', 100);
        $offset = ArrayHelper::getFromArray($_GET, 'offset', 0);

        $all = Game::readHighScore($this->gameId);

        die(json_encode([
            'result' => self::RESULT_SUCCESS,
            'data' => array_slice($all, $offset, $limit)
        ]));
    }

    public function actionSaveHighScore()
    {
        $score = ArrayHelper::getFromArray($_GET, 'score');
        $score = abs($score);
        if (!$score) {
            die(json_encode([
                'result' => self::RESULT_ERROR,
                'errors' => ['Can\'t save empty score!']
            ]));
        }

        $player = trim(ArrayHelper::getFromArray($_GET, 'player'));
        if (!$player) {
            die(json_encode([
                'result' => self::RESULT_ERROR,
                'errors' => ['Can\'t save score with no player name!']
            ]));
        }

        list($isHighScore, $position) = Game::isHighScore($this->gameId, $score);

        if (!$isHighScore) {
            die(json_encode([
                'result' => self::RESULT_ERROR,
                'errors' => ['This is not a high score']
            ]));
        }


        Game::saveHighScore($this->gameId, $score, $player, $position);
        die(json_encode([
            'result' => self::RESULT_SUCCESS,
            'data' => true
        ]));
    }

}