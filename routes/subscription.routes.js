import { Router } from 'express';
import { createSubscription, getSubscription, getUserSubscriptions, getSubscriptions } from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, getSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscription);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
    res.send('Update a subscription');
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send('Delete a subscription');
});

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send('Cancel a subscription');
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send('Get all upcoming renewals');
});


export default subscriptionRouter;