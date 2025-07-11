import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//api controller func to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.profile_image_url
                }
                await User.create(userData)
                res.json({})
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.profile_image_url
                }
                await User.findByIdAndDelete(data.id, userData)
                res.json({})
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break
            }

            default:
                break


        }
    } catch (error) {
        res.json({ success: false, messege: error.message })
    }
}


//stripe webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;
    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`);
    }

    //handing events
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });
            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId)

            const userData = await User.findById(purchaseData.userId)

            const courseData = await Course.findById(purchaseData.courseId.toString())

            //update : wrapped into if condition
            if (!courseData.enrolledStudents.includes(userData._id.toString())) {
                courseData.enrolledStudents.push(userData._id.toString());
            }
            await courseData.save()

            //update : wrapped into if condition
            if (!userData.enrolledCourses.includes(courseData._id.toString())) {
                userData.enrolledCourses.push(courseData._id.toString());
            }
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()

            console.log('payment is successful!');
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            });
            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId)

            purchaseData.status = 'failed'
            await purchaseData.save()

            console.log('paymentMethod is attached to customer!');
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    response.json({ received: true });
} 