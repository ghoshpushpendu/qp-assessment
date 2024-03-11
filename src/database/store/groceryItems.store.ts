import { Op } from 'sequelize';
import groceryItems from './../models/groceryItems';
import { GroceryItem } from '../../types/request.type';

const groceryItemsStore = {
    createNewItem: async (groceryItem: any): Promise<GroceryItem> => {
        groceryItem.deleted = 'false';
        const createditem = await groceryItems.create(groceryItem);
        return createditem.toJSON();
    },
    updateItemById: async (id: string, groceryItem: any): Promise<Object> => {
        const updatedItem = await groceryItems.update(groceryItem, {
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return updatedItem;
    },
    getItemById: async (id: string): Promise<GroceryItem> => {
        const item = await groceryItems.findOne({
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return item?.toJSON() as GroceryItem;
    },
    // soft deleting the grocery item
    deleteItemById: async (id: string): Promise<Object> => {
        const deletedItem = await groceryItems.update({
            deleted: 'true'
        }, {
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return deletedItem;
    },
    getAllAvailableItems: async (): Promise<GroceryItem[]> => {
        const items = await groceryItems.findAll({
            where: {
                deleted: 'false',
                quantity: {
                    [Op.gt]: 0
                }
            }
        });
        return items.map((item: any) => item.toJSON());
    },
    getAllItems: async (): Promise<GroceryItem[]> => {
        const items = await groceryItems.findAll({
            where: {
                deleted: 'false'
            }
        });
        return items.map((item: any) => item.toJSON());
    },
};

export default groceryItemsStore;