import { Module } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { DrinksService } from "src/drinks/drinks.service";

@Module({
  controllers: [StripeController],
  providers: [StripeService, DrinksService],
})
export class StripeModule {}
