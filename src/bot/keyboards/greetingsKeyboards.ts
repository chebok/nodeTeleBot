import { Markup } from 'telegraf';

export const greetingKeyboards = {
  admin: Markup.keyboard([
    ['Разместить заявку', 'Смотреть заявки'],
    ['Пользователи', 'Личный Кабинет'],
  ])
    .oneTime()
    .resize(),
};
