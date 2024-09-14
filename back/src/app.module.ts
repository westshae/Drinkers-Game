import { Module } from "@nestjs/common";
import { StripeModule } from "./stripe/stripe.module";
import { DrinksModule } from "./drinks/drinks.module";
import { LocationModule } from "./location/location.module";

@Module({
  imports: [
    DrinksModule,
    LocationModule,
    StripeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
