import { Body, Controller, Post, Res } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
@Controller('stripe') 
export class StripeController {
    @Post("charge_payment")
    async chargePayment(@Res() res:any,@Body() data:any):Promise<any> {
        try {
            const customer = await stripe.customers.create({
                description: data.business_description,
                name: data.customer_name,
                source: data.stripe_token
            })

            const paymentIntent = await stripe.paymentIntents.create({
                customer: customer.id,
                amount: parseFloat(data.amount).toFixed(),
                currency: "usd",
                payment_method_types: ['card'],
                // setup_future_usage: "on_session",
            });
            if(paymentIntent) {
                res.status(200).send({ "success": true, "successResponse": paymentIntent.client_secret, "customerID": customer.id })
            }
        }catch(err:any){
            console.log("err",err)
            res.status(403).send({ "success": false, "message": "Stripe Payment Failed" })
        }
    }
}
