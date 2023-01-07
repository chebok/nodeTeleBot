import { Markup } from 'telegraf';

export const orderKeyboards = {
  orderType: Markup.keyboard([
    [
      Markup.button.callback('Купить крипту', 'BUY'),
      Markup.button.callback('Продать крипту', 'SELL'),
    ],
  ])
    .oneTime()
    .resize(),

  criptoCurrency: Markup.keyboard([
    [
      Markup.button.callback('USDT', 'USDT'),
      Markup.button.callback('BTC', 'BTC'),
      Markup.button.callback('ETH', 'ETH'),
    ],
    [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
  ])
    .oneTime()
    .resize(),

  fiatCurrency: Markup.keyboard([
    [
      Markup.button.callback('USD', 'USD'),
      Markup.button.callback('EUR', 'EUR'),
      Markup.button.callback('RUB ', 'RUB'),
    ],
    [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
  ])
    .oneTime()
    .resize(),

  exit: Markup.keyboard([[Markup.button.callback('Выйти из оформления', 'Выйти из оформления')]])
    .oneTime()
    .resize(),

  market: Markup.inlineKeyboard([[Markup.button.callback('По рынку', 'market')]]),
  confirm: Markup.keyboard([
    [
      Markup.button.callback('Оформить', 'Оформить'),
      Markup.button.callback('Изменить', 'Изменить'),
    ],
    [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
  ])
    .oneTime()
    .resize(),
  returnToBegin: Markup.keyboard([[Markup.button.callback('Возврат на начало', 'return')]])
    .oneTime()
    .resize(),
};
