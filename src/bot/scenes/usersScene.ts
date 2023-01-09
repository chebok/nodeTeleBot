import { inject, injectable } from 'inversify';
import { Markup, Composer, Scenes } from 'telegraf';
import { TYPES } from '../../types';
import { IUsersService } from '../../users/users.service.interface';
import { MyContext } from '../bot.service';

interface Callback {
  data: string;
}

@injectable()
export class UsersScene {
  constructor(@inject(TYPES.IUsersService) private usersService: IUsersService) {}

  createScene(): Scenes.WizardScene<MyContext> {
    const startStep = new Composer<MyContext>();

    startStep.on('text', async (ctx) => {
      const users = await this.usersService.findAll();
      const usersWithButton = users.map((user) => [
        Markup.button.callback(
          `Пользователь ${user.username}. Статус авторизации ${user.authorized}`,
          `${user.id}`,
        ),
      ]);
      await ctx.replyWithHTML(
        'Выбери пользователя для редактирования',
        Markup.inlineKeyboard(usersWithButton),
      );
      return ctx.wizard.next();
    });

    const editing = new Composer<MyContext>();

    editing.on('callback_query', async (ctx) => {
      await ctx.answerCbQuery();
      const { data: id } = ctx.callbackQuery as Callback;
      ctx.scene.session.data = { id };
      await ctx.replyWithHTML(
        `Выберите операцию`,
        Markup.keyboard([
          [
            Markup.button.callback('авторизовать', 'авторизовать'),
            Markup.button.callback('разавторизовать', 'разавторизовать'),
            Markup.button.callback('выйти', 'выйти'),
          ],
        ])
          .oneTime()
          .resize(),
      );
      return ctx.wizard.next();
    });

    const finalStep = new Composer<MyContext>();

    finalStep.on('text', async (ctx) => {
      const id = Number(ctx.scene.session.data.id);
      if (ctx.message.text === 'авторизовать') {
        await this.usersService.authorizeUser(id, true);
        await ctx.replyWithHTML(`Теперь пользователь авторизован 👌`);
      }
      if (ctx.message.text === 'разавторизовать') {
        await this.usersService.authorizeUser(id, false);
        await ctx.replyWithHTML(`Теперь пользователь разавторизован`);
      }
      return ctx.scene.leave();
    });

    const usersScene = new Scenes.WizardScene<MyContext>(
      'usersScene',
      startStep,
      editing,
      finalStep,
    );
    return usersScene;
  }
}
