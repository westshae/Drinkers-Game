import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import Stripe from "stripe";
import { DrinksService } from "src/drinks/drinks.service";

@Controller("stripe")
export class StripeController {
  private stripe: Stripe;

  constructor(private readonly stripeService: StripeService, private readonly drinksService: DrinksService) {
    this.stripe = new Stripe(process.env.STRIPE_TEST_KEY);
  }


  @Post("getPaymentLink")
  async getPaymentLink(){
    const result = await this.stripeService.createPaymentLink()
    return result;
  }

  @Post("webhook")
  async handleWebhook(@Req() request) {

    const type = request.body.type;
    const metadata = request.body.data.object.metadata;
    const paymentStatus = request.body.data.object.payment_status;

    if(type == "checkout.session.completed" && paymentStatus == "paid" && metadata.product_id && metadata.product_id == "coffee_one"){
      let order = this.drinksService.initOrder(23,metadata.order_id, 1);
    }
  }
}
