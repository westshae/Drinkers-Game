import { Module } from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { DrinksController } from "./drinks.controller";
import { DrinksService } from "./drinks.service";

@Module({
  controllers: [DrinksController],
  providers: [DrinksService, StripeService],
})
export class DrinksModule {}
