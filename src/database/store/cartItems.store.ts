import { CartItem } from '../../types/request.type';
import cartItems from './../models/cartItems';

const cartItemsStore = {
    addCartItem: async (userId: number, groceryItemId: number, quantity: number) : Promise<CartItem> => {
        const item = await cartItems.create({ userId, groceryItemId, quantity, deleted: 'false' });
        return item.toJSON();
    },
    getCartItems: async (userId: string) : Promise<CartItem[]> => {
        const items = await cartItems.findAll({ where: { userId: userId, deleted: 'false' } });
        return items.map((item: any) => item.toJSON());
    },
    updateCartItem: async (cartId: string, updateObject: object) : Promise<Object> => {
        return await cartItems.update({ ...updateObject }, { where: { id: cartId, deleted: 'false' } });
    },
    deleteCartItem: async (cartId: string) : Promise<Object> => {
        return await cartItems.update({ deleted: 'true' }, { where: { id: cartId, deleted: 'false' } });
    },
    getCartItemById: async (cartId: string) : Promise<CartItem> => {
        const item = await cartItems.findOne({ where: { id: cartId } });
        return item?.toJSON() as CartItem;
    }
};

export default cartItemsStore;