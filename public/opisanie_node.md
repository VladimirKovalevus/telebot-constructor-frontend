## TZ

Все события можно разделить на две большие группы: Events и Actions. Events - это события, которые происходят в зависимости от определенных обстоятельств (например, отправка сообщения). Actions - это активные действия пользователя (например, нажатие кнопки).

Events:

- OnMessage:
  - Входящие сокеты: Нет
  - Исходящие сокеты: Дальнейшие действия, текст, ID пользователя
- OnCommand:
  - Входящие сокеты: Название команды
  - Исходящие сокеты: Дальнейшие действия, ID пользователя
- Timer:
  - Входящие сокеты: Событие для запуска таймера
  - Исходящие сокеты: Дальнейшие действия по истечению времени, действия прерывания

Actions:

- SendMessage:
  - Входящие сокеты: Инициатор, текст
- Button:
  - Параметры: Текст на кнопке, возможно дополнительные параметры
  - Исходящие сокеты: Дальнейшие действия

Потенциально, параметров для отправки кнопки может быть много, поэтому необходимо предусмотреть возможность настройки каждого из них. Например, в Telegram я могу привязать к кнопке множество флагов и запросить у пользователя определенные данные с помощью этих флагов.

TodoList:

1. Экспорт и Импорт
2. Новые ноды из tZ
3. Добавить добавление ключ в Bot
4. Сделать общий дизайн для бота и смену темы.
