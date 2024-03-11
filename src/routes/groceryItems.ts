import express from 'express';
import groceryItemsStore from './../database/store/groceryItems.store';
import { GroceryItem, User } from '../types/request.type';
const router = express.Router();

router.get('/', async (req: any, res) => {
    const authenticatedUser: User = req.user;
    if (authenticatedUser.role !== 'admin') {
        const items: GroceryItem[] = await groceryItemsStore.getAllItems();
        res.status(200).json({ items });
    } else {
        const items: GroceryItem[] = await groceryItemsStore.getAllAvailableItems();
        res.status(200).json({ items });
    }
});

router.post('/', async (req: any, res) => {
    const authenticatedUser: User = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const groceryItem: GroceryItem = req.body;
    try {
        const createdItem: GroceryItem = await groceryItemsStore.createNewItem(groceryItem);
        res.status(200).json({ item: createdItem });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req: any, res) => {
    const authenticatedUser: User = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const groceryItem: GroceryItem = req.body;
    const id: string = req.params.id;
    try {
        const updatedItem : Object = await groceryItemsStore.updateItemById(id, groceryItem);
        res.status(200).json({ item: updatedItem });
    }
    catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.delete('/:id', async (req: any, res) => {
    const authenticatedUser: User = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const id:string = req.params.id;
    try {
        const deletedItem: Object = await groceryItemsStore.deleteItemById(id);
        res.status(200).json({ item: deletedItem });
    }
    catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;