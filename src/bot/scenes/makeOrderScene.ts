import { OrderType, PriceType } from '@prisma/client';
import axios from 'axios';
import { ValidationError } from 'class-validator';
import { inject, injectable } from 'inversify';
import { Markup, Composer, Scenes } from 'telegraf';
import { IOrderService } from '../../order/order.service.interface';
import { TYPES } from '../../types';
import { MyContext } from '../bot.service';
import { orderKeyboards } from '../keyboards/orderKeyboards';

@injectable()
export class MakeOrderScene {
  constructor(@inject(TYPES.IOrderService) private orderService: IOrderService) {}

  refactorValidate(errors: ValidationError[]): string {
    const result: string[] = [];
    errors.forEach((err) => {
      if (err.constraints) {
        result.push(...Object.values(err.constraints));
      }
    });
    return result.toString();
  }

  async getMarketRate(cryptoCur: string, fiatCur: string): Promise<number> {
    const res = await axios.get(
      `https://garantex.io/api/v2/trades?market=${cryptoCur.toLowerCase()}${fiatCur.toLowerCase()}`,
    );
    const result = res.data[0];
    return Number(result.price);
  }

  createScene(): Scenes.WizardScene<MyContext> {
    const chooseOrderTypeStep = new Composer<MyContext>();

    chooseOrderTypeStep.on('text', async (ctx) => {
      ctx.scene.session.data = {};
      ctx.scene.session.data.userName = ctx.message.from.username;
      await ctx.replyWithHTML('Выберите тип операции', orderKeyboards.orderType);
      return ctx.wizard.next();
    });

    const cryptoStep = new Composer<MyContext>();

    cryptoStep.on('text', async (ctx) => {
      ctx.scene.session.data.orderType =
        ctx.message.text === 'Купить крипту' ? OrderType.BUY : OrderType.SELL;
      await ctx.replyWithHTML(
        'Выберите криптовалюту\n Например USDT',
        orderKeyboards.criptoCurrency,
      );
      return ctx.wizard.next();
    });

    const countStep = new Composer<MyContext>();

    countStep.on('text', async (ctx) => {
      if (ctx.message.text === 'Выйти из оформления') {
        return ctx.scene.leave();
      }
      ctx.scene.session.data.cryptoCurrency = ctx.message.text;
      await ctx.replyWithHTML(
        'Укажите количество криптовалюты\n Например 1000',
        orderKeyboards.exit,
      );
      return ctx.wizard.next();
    });

    const fiatStep = new Composer<MyContext>();

    fiatStep.on('text', async (ctx) => {
      if (ctx.message.text === 'Выйти из оформления') {
        return ctx.scene.leave();
      }
      ctx.scene.session.data.count = ctx.message.text;
      await ctx.replyWithHTML(
        'Выберите фиатную валюту\n Например RUB',
        orderKeyboards.fiatCurrency,
      );
      return ctx.wizard.next();
    });

    const priceStep = new Composer<MyContext>();

    priceStep.on('text', async (ctx) => {
      if (ctx.message.text === 'Выйти из оформления') {
        return ctx.scene.leave();
      }
      ctx.scene.session.data.fiatCurrency = ctx.message.text;
      await ctx.replyWithHTML(
        'Укажите курс за единицу криптовалюты\n Например 1 или выберите рыночный',
        orderKeyboards.market,
      );
      return ctx.wizard.next();
    });

    const confirmStep = new Composer<MyContext>();

    confirmStep.action('market', async (ctx) => {
      await ctx.answerCbQuery();
      try {
        ctx.scene.session.data.price = await this.getMarketRate(
          ctx.scene.session.data.cryptoCurrency,
          ctx.scene.session.data.fiatCurrency,
        );
      } catch {
        await ctx.replyWithHTML('Указанных валют не существует', orderKeyboards.exit);
        return ctx.wizard.next();
      }
      ctx.scene.session.data.price = await this.getMarketRate(
        ctx.scene.session.data.cryptoCurrency,
        ctx.scene.session.data.fiatCurrency,
      );
      ctx.scene.session.data.priceType = PriceType.MARKET;
      const reqData = ctx.scene.session.data;
      await ctx.replyWithHTML(
        `Вы хотите ${reqData.orderType} ${reqData.count} ${reqData.cryptoCurrency}. Фиат ${reqData.fiatCurrency} по курсу ${reqData.price}.\nОформляем заявку?`,
        orderKeyboards.confirm,
      );
      return ctx.wizard.next();
    });

    confirmStep.on('text', async (ctx) => {
      ctx.scene.session.data.price = ctx.message.text;
      ctx.scene.session.data.priceType = PriceType.MANUAL;
      const reqData = ctx.scene.session.data;
      await ctx.replyWithHTML(
        `Вы хотите ${reqData.orderType} ${reqData.count} ${reqData.cryptoCurrency}. Фиат ${reqData.fiatCurrency} по курсу ${reqData.price}.\nОформляем заявку?`,
        orderKeyboards.confirm,
      );
      return ctx.wizard.next();
    });

    const finalStep = new Composer<MyContext>();

    finalStep.on('text', async (ctx) => {
      if (ctx.message.text === 'Оформить') {
        const chatId = ctx.session.user.chat_id;
        const { orderType, cryptoCurrency, count, fiatCurrency, price, priceType } =
          ctx.scene.session.data;
        try {
          const orderOrErrors = await this.orderService.createOrder({
            orderType,
            cryptoCurrency,
            count: Number(count),
            fiatCurrency,
            price: Number(price),
            priceType,
            chatId,
          });
          const textMessage = Array.isArray(orderOrErrors)
            ? this.refactorValidate(orderOrErrors)
            : `Заявка успешно оформлена id${orderOrErrors.id}`;
          await ctx.replyWithHTML(textMessage);
        } catch (error) {
          await ctx.replyWithHTML(
            'Произошла ошибка при создании заявки. Обратитесь к администратору',
          );
        }
      }
      if (ctx.message.text === 'Изменить') {
        await ctx.replyWithHTML('Заявка отменена', orderKeyboards.returnToBegin);
        return ctx.wizard.selectStep(ctx.wizard.cursor - 6);
      }
      return ctx.scene.leave();
    });

    const makeOrderScene = new Scenes.WizardScene<MyContext>(
      'makeOrderScene',
      chooseOrderTypeStep,
      cryptoStep,
      countStep,
      fiatStep,
      priceStep,
      confirmStep,
      finalStep,
    );
    return makeOrderScene;
  }
}
