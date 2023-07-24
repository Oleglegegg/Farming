# Farming
contract https://goerli.etherscan.io/address/0xfc5552338b927D92661FC078cB32Dd21658280A6
stacking https://goerli.etherscan.io/address/0x514e8e521003a4b149827be3efd1fc135c60c3c5
reward   https://goerli.etherscan.io/address/0x0d599a3b532fc241ba3cac733402656eb2c03b1d


## Задача:

- Максимальная продолжительность: 3 месяца (farming)
- Токен для пополнения счета: LP-токен
- Максимальная общая сумма для ставки: 1000 LP-токенов
- Процент ставки: 10% в месяц
- Токен для вознаграждения: ERC20

## Задание:

- Дописать функции `withdraw` и `claimRewards`;
- Написать test, task, scripts. При написании test нужно форкунить mainnet и проверить LP токены
- Переделать `hardhat.config.ts`
- Задеплоить в `mumbai` 2 erc20, 1 farming contract. Не обязательно создавать LP токен в `mumbai` можно создать 1 reward token и 1 staking token.
- Верифицировать контракты
