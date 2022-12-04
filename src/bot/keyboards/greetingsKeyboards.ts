import { Markup } from 'telegraf';

export const greetingKeyboards = {
  default: Markup.keyboard([['Разместить заявку'], ['Смотреть все заявки']])
    .oneTime()
    .resize(),
};
