# Blockchain-Based Online Auction

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/blockchain-online-auction/blob/main/LICENSE)

Welcome to the Blockchain-Based Online Auction project! This repository contains the code and resources for building a decentralized online auction platform using blockchain technology. The aim of this project is to create a transparent, secure, and tamper-proof system for conducting online auctions.

## Features

- **Decentralization:** The auction platform is built on a blockchain network, ensuring decentralization and eliminating the need for a central authority.

- **Transparency:** All transactions and bids made during the auction are recorded on the blockchain, providing transparency and auditability.

- **Security:** The use of blockchain technology ensures the security of the auction process, making it resistant to fraud and tampering.

- **Immutable Records:** Once a bid or transaction is recorded on the blockchain, it becomes immutable, preventing any unauthorized modifications.

- **Smart Contracts:** Smart contracts are utilized to automate the auction process, enabling participants to interact directly with the blockchain.

## Prerequisites

To run the Blockchain-Based Online Auction platform locally, ensure you have the following prerequisites installed:

- Node.js (v14 or higher)
- Truffle
- Ganache
- Serverless

## Getting Started

Follow these steps to get the auction platform up and running on your local machine:

1. Clone this repository: `git clone https://github.com/yourusername/blockchain-online-auction.git`
2. Install dependencies: `npm install` in:
   - frontend directory
   - backend/sls directory
   - backend/smart-contracts directory
4. Start AWS EC2 instance, get its Public IP
5. Using public IP connect to the instance using Putty or WinSCP, restart ganache and grep new accounts/keys
6. Paste Public IP in truffle-config.json and excute `truffle migrate --network awsganache`
7. Copy MainContract address and paste in into server.js located on EC2 /home/ec2-user/listener
8. Copy build artifacts (MainContract.json and Auction.json) to EC2 instance /home/ec2-user/listener
9. Copy build artifacts (MainContract.json and Auction.json) to sls contracts folder
10. Paste Public IP to serverless yuml as eth_node_url
11. Execute sls deploy
12. On the EC2 instance execute: Start listener service on EC2 server: `sudo systemctl start listener`
13. In frontend folder execute `npm start`
14. Access the application in your browser at `http://localhost:3000`

## Usage

Once the application is up and running, you can use it to participate in online auctions. Here are the general steps involved:

1. Create an account or log in with your existing account.
2. Browse the available auctions and select the one you want to participate in.
3. Place your bid by specifying the amount you're willing to bid.
4. Wait for the auction to close or monitor the progress of other bids.
5. If you win the auction, proceed with the payment to complete the transaction.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.


=================================================================================


Ласкаво просимо до проекту онлайн-аукціону на основі блокчейну! Це сховище містить код і ресурси для створення децентралізованої платформи онлайн-аукціону з використанням технології блокчейн. Метою цього проекту є створення прозорої, безпечної та захищеної від втручання системи для проведення онлайн-аукціонів.

## Особливості

- **Децентралізація:** Аукціонна платформа побудована на основі мережі блокчейн, що забезпечує децентралізацію та усуває потребу в центральному органі влади.

- **Прозорість:** усі транзакції та ставки, зроблені під час аукціону, реєструються в блокчейні, що забезпечує прозорість і можливість перевірки.

- **Безпека:** Використання технології блокчейн забезпечує безпеку процесу аукціону, роблячи його стійким до шахрайства та втручання.

- **Незмінні записи:** як тільки ставка або транзакція зареєстровані в блокчейні, вони стають незмінними, запобігаючи будь-яким неавторизованим змінам.

- **Розумні контракти:** Смарт-контракти використовуються для автоматизації процесу аукціону, що дозволяє учасникам безпосередньо взаємодіяти з блокчейном.

## Передумови

Щоб запустити платформу онлайн-аукціону на основі блокчейну локально, переконайтеся, що у вас встановлено такі передумови:

- Node.js (версія 14 або вище)
- Трюфель
- Ганаш
- Безсерверний

## Починаємо

Виконайте такі дії, щоб запустити аукціонну платформу на локальному комп’ютері:

1. Клонуйте це сховище: `git clone https://github.com/yourusername/blockchain-online-auction.git`
2. Встановити залежності: `npm install`
   - в директорії frontend
   - в директорії backend/sls
   - в директорії backend/smart-contract
4. Запустіть екземпляр AWS EC2, отримайте його загальнодоступну IP-адресу
5. Використовуючи загальнодоступну IP-адресу, підключіться до екземпляра за допомогою Putty або WinSCP, перезапустіть ganache і grep нові облікові записи/ключі
6. Вставте публічну IP-адресу в truffle-config.json і виконайте `truffle migrate --network awsganache`
7. Скопіюйте адресу MainContract і вставте її в файл server.js, розташований на EC2 /home/ec2-user/listener
8. Скопіюйте артефакти збірки (MainContract.json і Auction.json) до екземпляра EC2 /home/ec2-user/listener
9. Скопіюйте артефакти збірки (MainContract.json і Auction.json) до папки sls contracts
10. Вставте загальнодоступну IP-адресу в безсерверний yuml як eth_node_url
11. Виконайте sls deploy
12. На екземплярі EC2 виконайте: Запустіть службу слухача на сервері EC2: `sudo systemctl start listener`
13. У папці інтерфейсу виконайте `npm start`
14. Відкрийте програму у своєму браузері за адресою `http://localhost:3000`

## Використання

Після того, як додаток буде запущено, ви зможете використовувати його для участі в онлайн-аукціонах. Ось загальні етапи:

1. Створіть обліковий запис або увійдіть за допомогою наявного облікового запису.
2. Перегляньте доступні аукціони та виберіть той, у якому ви хочете взяти участь.
3. Зробіть ставку, вказавши суму, яку ви готові зробити.
4. Дочекайтеся завершення аукціону або спостерігайте за ходом інших ставок.
5. Якщо ви виграєте аукціон, здійсніть оплату, щоб завершити транзакцію.

## Ліцензія

Цей проект ліцензовано згідно з ліцензією MIT. Додаткову інформацію див. у файлі [LICENSE](LICENSE).
