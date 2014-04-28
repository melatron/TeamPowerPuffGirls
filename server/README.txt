Документация на Хай Скор АПИ на финалните проекти в Imperia Online JS Training Camp

Въведение

Апи-то отгваря на ГЕТ заявки ,
които указват кой екшън искате да се извика и параметрите, които трябва да се подадат.

Екшъни

Екъшънът се подава като параметър в урл-а, пример :
http://urltoapi/?route=high-score/<actionName>&gameId=<game id>

Идентифицирате се пред платформата с вашето gameId -> уникален идентификатор на играта
Това са идентификаторите на вашите игри
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

Възможни екшъни:
    is-high-score

    Параметри - score - задължителен, цяло положително число
    Логика - проверява дали резултатът е в 100-те най-добри
    Отговор: true|false

    get-high-score

    Параметри - limit - колко резултата да върне (100 по подразбиране)
              - offset - от къде да започне (лимит 10 офсет 20 дава резултатите от 21 до 30  включително)

    Логика - връща масив от обекти в JSON формат [{score: <Number>, name: <String>, time: <Number>}, {score: <Number>, name: <String>, time: <Number>}]
    Отговор:[{score: <Number>, name: <String>, time: <Number>}, {score: <Number>, name: <String>, time: <Number>}]

    save-high-score

    Параметри - score - number -  точките на играча
              - player - String - име на играча

    Логика - запазва реаултата на играча
    Отговор: true|false


