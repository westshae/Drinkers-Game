import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import "dotenv/config";
import { finalize, interval, map, switchMap, takeWhile } from "rxjs";

@Injectable()
export class DrinksService {
  async authenticateUser(session) {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);
    const user = await supabase.auth.getUser(session.access_token);
    if (user.data.user.id === session.user.id) {
      return true
    }
    return false;
  }

  async getAvailableDrinks() {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);

    const drinkEntries = (await supabase.from("drinks").select("*")).data;

    return drinkEntries;
  }

  handleUpdateSSE(orderId) {
    let data = {
      message: null,
      type: null,
      orderId: null,
      pin: null
    };
    let previouslySent = null;
    
    return interval(4000).pipe(
      takeWhile(() => previouslySent !== "orderCompleted"), 
      switchMap(async () => {
        const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);
        const orderData = (await supabase.from("orders").select("*").eq("orderId", orderId).single()).data;
  
        if (!orderData) {
          return null;
        }

        const booleanFields = [
          "orderStarted",
          "dryStepsCompleted",
          "extractionStepsCompleted",
          "milkStepsCompleted",
          "orderCompleted",
        ];
  
        for (const field of booleanFields) {
          switch (field){
            case "orderStarted":
              if(orderData.orderStarted){
                data.message = field;
                data.type = "update"
              }
            case "dryStepsCompleted":
              if(orderData.dryStepsCompleted){
                data.message = field;
                data.type = "update"
              }
            case "extractionStepsCompleted":
              if(orderData.extractionStepsCompleted){
                data.message = field;
                data.type = "update"
              }
            case "milkStepsCompleted":
              if(orderData.milkStepsCompleted){
                data.message = field;
                data.type = "update"
              }
            case "orderCompleted":
              if(orderData.orderCompleted){
                data.message = field;
                data.type = "complete"
                data.pin = 12345
                data.orderId = orderData.orderId
              }
          }
          previouslySent = data
        }
  
        return { data: data }
      }),
      map((data) => data ? data : null)
    );
  }
  
  async initOrder(locationId, orderId, coffeeTypeId) {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);
    let order = await supabase.from("orders").insert({ 
      orderId: orderId, 
      coffeeTypeId: coffeeTypeId, 
      dryStepsCompleted: false, 
      extractionStepsCompleted: false, 
      milkStepsCompleted: false, 
      orderCompleted: false, 
      orderStarted: false 
    })
    await axios.post(`${process.env.VENDING_MACHINE_URL}/instructions/OrderCoffee`, {
      locationId: locationId,
      orderId: orderId,
      coffeeTypeId: coffeeTypeId
    })

    return order;
  }

  async addOrderProgressToOrder(orderId, progressCompleted) {
    const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_PRIV_API_KEY);
    let orderData = (await supabase.from("orders").select("*").eq("orderId", orderId).single()).data;
    switch(progressCompleted){
      case "dryStepsCompleted":
        orderData.dryStepsCompleted = true
        break;
      case "extractionStepsCompleted":
        orderData.extractionStepsCompleted = true
        break;
      case "milkStepsCompleted":
        orderData.milkStepsCompleted = true
        break;
      case "orderCompleted":
        orderData.orderCompleted = true
        break;
      case "orderStarted":
        orderData.orderStarted = true
        break;
      default:
        throw new Error(`${process} process not accounted for`)
    }
    const { data, error } = await supabase
      .from("orders")
      .update(orderData)
      .eq("orderId", orderId)
      .single();
    return data
  }
}