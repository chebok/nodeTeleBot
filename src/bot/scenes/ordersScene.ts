import { inject, injectable } from 'inversify';
import { Markup, Composer, Scenes } from 'telegraf';
import { CurrencyService } from '../../currency/currency.service';
import { IOrderService } from '../../order/order.service.interface';
import { TYPES } from '../../types';
import { MyContext } from '../bot.service';
import { keyBy } from 'lodash';

interface Callback {
  data: string;
}

@injectable()
export class OrdersScene {
  constructor(
    @inject(TYPES.IOrderService) private orderService: IOrderService,
    @inject(TYPES.CurrencyService) private currencyService: CurrencyService,
  ) {}

  createScene(): Scenes.WizardScene<MyContext> {
    const startStep = new Composer<MyContext>();

    startStep.on('text', async (ctx) => {
      const orders = await this.orderService.findMany();
      const curs = await this.currencyService.findAll();
      const cursWithKeyId = keyBy(curs, (cur) => cur.id);
      const ordersWithButton = orders.map(
        ({ id, orderType, count, price, cryptoCurrencyId, fiatCurrencyId }) => [
          Markup.button.callback(
            `${id}. ${orderType} ${count} ${cursWithKeyId[cryptoCurrencyId].title}. Fiat ${cursWithKeyId[fiatCurrencyId].title}, price ${price}`,
            `${id}`,
          ),
        ],
      );
      await ctx.replyWithHTML('Выбери заявку', Markup.inlineKeyboard(ordersWithButton));
      return ctx.wizard.next();
    });

    const viewStep = new Composer<MyContext>();

    viewStep.on('callback_query', async (ctx) => {
      await ctx.answerCbQuery();
      const { data: id } = ctx.callbackQuery as Callback;
      ctx.scene.session.data = { id };
      await ctx.replyWithHTML(
        `Выберите операцию`,
        Markup.keyboard([[Markup.button.callback('выйти', 'выйти')]])
          .oneTime()
          .resize(),
      );
      return ctx.wizard.next();
    });

    const ordersScene = new Scenes.WizardScene<MyContext>('ordersScene', startStep, viewStep);
    return ordersScene;
  }
}
