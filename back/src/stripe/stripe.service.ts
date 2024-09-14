import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_KEY)
    }

    async createPaymentLink(): Promise<{link: string, order_id: string}> {
        try {
            const product = await this.stripe.products.create({
                name: "Buying a coffee",
            });

            const price = await this.stripe.prices.create({
                unit_amount: 3000,
                currency: 'usd',
                product: product.id,
                
            });

            const paymentLink = await this.stripe.paymentLinks.create({
                line_items: [
                    {
                        price: price.id,
                        quantity: 1,
                    },
                ],
                metadata: {
                    product_id: "coffee_one",
                    order_id: product.id
                },
                after_completion: {
                    redirect: {
                        url: `${process.env.FRONTEND_URL}/updates?id=${product.id}`,
                    },
                    type: "redirect"
                }
            
            });

            return {
                link: paymentLink.url,
                order_id: product.id
            }

        } catch (error) {
            console.error('Error creating Stripe payment link:', error);
            throw new InternalServerErrorException('Failed to create Stripe payment link');
        }
    }
}