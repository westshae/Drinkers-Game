import { Body, Controller, Get, Post, Query, Sse} from "@nestjs/common";
import { StripeService } from "src/stripe/stripe.service";
import { DrinksService } from "./drinks.service";
import { catchError, Observable, of } from "rxjs";

interface MessageEvent {
  data: string | object;
  id?: string;
  type?: string;
  retry?: number;
}

@Controller("drinks")
export class DrinksController {
  constructor(private readonly drinksService: DrinksService, private readonly stripeService: StripeService) {}

  @Get("getAvailableDrinks")
  async getAvailableDrinks() {
    const result = await this.drinksService.getAvailableDrinks();
    return result;
  }

  @Sse('getUpdates')
  getUpdates(@Query('orderId') orderId: number): Observable<MessageEvent> {
    if (!orderId) {
      // Return an empty Observable or handle the case when orderId is missing
      return of({ data: { error: 'Order ID is required' } });
    }

    return this.drinksService.handleUpdateSSE(orderId).pipe(
      catchError(error => {
        console.error('Error in SSE handler:', error);
        return of({ data: { error: 'An error occurred' } });
      })
    );
  }

  @Post("addOrder")
  async addOrder(@Body() body) {
    if(!body.locationId || !body.orderId || !body.coffeeTypeId) {
      return {
        message: "no body.locationId or no body.orderId or no body.coffeeTypeId",
        data: null
      }
    }

    let order = this.drinksService.initOrder(body.locationId, body.orderId, body.coffeeTypeId);
    return order
  }

  @Post("postUpdateOnOrder")
  async postUpdateOnOrder(@Body() body) {
    if(!body.orderId || !body.progressCompleted) {
      return {
        message: "no body.orderId or no body.progressCompleted",
        data: null
      }
    }
    let order = this.drinksService.addOrderProgressToOrder(body.orderId, body.progressCompleted)
    return order;

  }

}