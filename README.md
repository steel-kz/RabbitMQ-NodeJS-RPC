Проект представляет собой пример реализации паттерна запрос-ответ посредством использования платформы обмена сообщениями RabbitMQ и NodeJS (Typescript). Имеется 2 микросервиса: RPC_Client и RPC_Server, которые играют роли Потребителя (Подписчика) и Производителя (Издателя). RPC_Client, создает очередь RPC, из которой RPC_Server потребляет сообщения, и затем производит обработку данных и возвращает ответ, создав очередь ответов, из которой RPC_Client потребляет ответы. 
Логи сохраняются в файл с именем application.log. Файл создается в том же каталоге, где запускается скрипт. Вы можете изменить имя файла или путь к файлу, чтобы управлять местом, где создаются файлы журнала.