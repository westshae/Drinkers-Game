import { Module } from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";

@Module({
  controllers: [LocationController],
  providers: [LocationService, StripeService],
})
export class LocationModule {}
