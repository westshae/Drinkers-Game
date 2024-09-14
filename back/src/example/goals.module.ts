import { Module } from "@nestjs/common";
import { GoalsController } from "./goals.controller";
import { GoalsService } from "./goals.service";
import { StripeService } from "src/stripe/stripe.service";

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, StripeService],
})
export class GoalsModule {}
