import express from 'express';
import cartItemsStore from '../database/store/cartItems.store';
import groceryItemsStore from '../database/store/groceryItems.store';
import { CartItem, GroceryItem, User } from '../types/request.type';
const router = express.Router();

router.post('/', async (req: any, res) => {
    try {
        const authenticatedUser: User = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const { userId, groceryItemId, quantity } = req.body;
        // decrement the quantity of the grocery item in the groceryItems table
        const groceryItem: GroceryItem = await groceryItemsStore.getItemById(groceryItemId);
        if (groceryItem.quantity < quantity) {
            res.status(400).send('Not enough quantity available');
            return;
        }
        await groceryItemsStore.updateItemById(groceryItemId, { quantity: groceryItem.quantity - quantity });
        const cartItem: CartItem = await cartItemsStore.addCartItem(authenticatedUser.id as any, groceryItemId, quantity);
        res.status(200).send(cartItem);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', async (req: any, res) => {
    try {
        const authenticatedUser: User = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const userId : string = authenticatedUser.id as string;
        const cartItems : CartItem[] = await cartItemsStore.getCartItems(userId);
        res.status(200).send(cartItems);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req: any, res) => {
    try {
        const authenticatedUser: User = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const cartId : string = req.params.id;
        const updateObject  = req.body;
        const cartItem: CartItem = await cartItemsStore.getCartItemById(cartId);
        const updatedCartItem : Object = await cartItemsStore.updateCartItem(cartId, updateObject);
        if(updateObject.quantity) {
            //TODO : check the operation is not making grocery item quantity negative
            // increment the quantity of the grocery item in the groceryItems table
            const groceryItem: GroceryItem = await groceryItemsStore.getItemById(cartItem.groceryItemId);
            await groceryItemsStore.updateItemById(cartItem.groceryItemId, { quantity: groceryItem.quantity + cartItem.quantity - updateObject.quantity });
        }

        res.status(200).send(updatedCartItem);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req: any, res) => {
    try {
        const authenticatedUser: User = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const cartId:string = req.params.id;
        const cartItem: CartItem = await cartItemsStore.getCartItemById(cartId);
        const deletedCartItem: Object = await cartItemsStore.deleteCartItem(cartId);
        // increment the quantity of the grocery item in the groceryItems table
        const groceryItem: GroceryItem = await groceryItemsStore.getItemById(cartItem.groceryItemId);
        await groceryItemsStore.updateItemById(cartItem.groceryItemId, { quantity: groceryItem.quantity + cartItem.quantity });
        res.status(200).send(deletedCartItem);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;

