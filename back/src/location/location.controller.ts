import { Body, Controller, Get, Post, Query} from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { LocationService } from "./location.service";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService, private readonly stripeService: StripeService) {}

  @Get("getAvailableLocations")
  async getAvailableLocations() {
    const result = (await this.locationService.getAvailableLocations()).data;
    return result;
  }

  @Post("releaseOrder")
  async releaseOrder(@Body() body){
    if(!body.orderId || !body.pin) {
      return {
        message: "no body.orderId or no body.pin",
        data: null
      }
    }

    return {
      message: "Success",
      data: "A5"
    }
  }

}
