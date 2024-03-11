import testHelpers from './../testHelper';
import groceryItemData from './../samples/grocery.json';
import _ from 'lodash';
import GroceryItems from '../../src/database/models/groceryItems';
import CartItems from '../../src/database/models/cartItems';
import User from '../../src/database/models/user';
import should from 'should';
import request from 'supertest';
import server from '../../src/index';

describe('cartItems as user', () => {
    let authenticatedUser: any;
    const createdUserIds: string[] = [];
    const createdGroceryItemIds: string[] = [];
    const createdCartItemsIds: string[] = [];

    beforeEach(async () => {
        authenticatedUser = await testHelpers.createUserByRole('user');
        createdUserIds.push(authenticatedUser.id);
    });

    afterEach(async () => {
        await deleteTestUsers(createdUserIds);
        await deleteTestGroceryItems(createdGroceryItemIds);
        await deleteTestCartItems(createdCartItemsIds);
    });

    it('should add a cart item and return 200', async () => {
        const groceryItem = await createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const response = await request(server)
            .post('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ userId: authenticatedUser.id, groceryItemId: groceryItem[0].id, quantity: 2 });
        should(response.status).be.exactly(200);
        const data = response.body;
        should(data.userId).be.exactly(authenticatedUser.id);
        should(data.groceryItemId).be.exactly(groceryItem[0].id);
        should(data.quantity).be.exactly(2);
    });

    it('should get cart items and return 200', async () => {
        const groceryItem = await createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        await createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        const response = await request(server)
            .get('/cartItems/')
            .set('authorization', authenticatedUser.token);
        should(response.status).be.exactly(200);
        const data = response.body;
        should(data.length).be.exactly(1);
        should(data[0].userId).be.exactly(authenticatedUser.id);
        should(data[0].groceryItemId).be.exactly(groceryItem[0].id);
        should(data[0].quantity).be.exactly(2);
    });

    it('should update cart item and return 200', async () => {
        const groceryItem = await createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const cartItem = await createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        createdCartItemsIds.push(cartItem.id);
        const response = await request(server)
            .put('/cartItems/'+cartItem.id)
            .set('authorization', authenticatedUser.token)
            .send({ quantity: 5 });
        should(response.status).be.exactly(200);
        const data = response.body;
        should(data[0]).be.exactly(1);
    });

    it('should delete cart item and return 200', async () => {
        const groceryItem = await createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const cartItem = await createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        createdCartItemsIds.push(cartItem.id);
        const response = await request(server)
            .delete(`/cartItems/${cartItem.id}`)
            .set('authorization', authenticatedUser.token);
        should(response.status).be.exactly(200);
        const data = response.body;
        should(data[0]).be.exactly(1);
    });
});

describe('cartItems as admin', () => {
    let authenticatedUser: any;
    const createdUserIds: string[] = [];
    const createdGroceryItemIds: string[] = [];
    const createdCartItemsIds: string[] = [];

    beforeEach(async () => {
        authenticatedUser = await testHelpers.createUserByRole('admin');
        createdUserIds.push(authenticatedUser.id);
    });

    afterEach(async () => {
        await deleteTestUsers(createdUserIds);
        await deleteTestGroceryItems(createdGroceryItemIds);
        await deleteTestCartItems(createdCartItemsIds);
    });

    it('should not add a cart item and return 403', async () => {
        const groceryItem = await createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const response = await request(server)
            .post('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ userId: authenticatedUser.id, groceryItemId: groceryItem[0].id, quantity: 2 });
        should(response.status).be.exactly(403);
    });

    it('should not get cart items and return 403', async () => {
        const response = await request(server)
            .get('/cartItems/')
            .set('authorization', authenticatedUser.token);
        should(response.status).be.exactly(403);
    });

    it('should not update cart item and return 403', async () => {
        const response = await request(server)
            .put('/cartItems/1')
            .set('authorization', authenticatedUser.token)
            .send({ cartId: 1, updateObject: { quantity: 5 } });
        should(response.status).be.exactly(403);
    });

    it('should not delete cart item and return 403', async () => {
        const response = await request(server)
            .delete('/cartItems/1')
            .set('authorization', authenticatedUser.token);
        should(response.status).be.exactly(403);
    });
});


async function createGroceryItem(count: number = 1) {
    const groceryItemObject = _.cloneDeep(groceryItemData);
    groceryItemObject.quantity = 10;
    const promises: any[] = [];
    for (let i = 0; i < count; i++) {
        const groceryItem = GroceryItems.create(groceryItemObject);
        promises.push(groceryItem);
    }
    const createdGroceryItems = await Promise.all(promises);
    return createdGroceryItems.map((item: any) => item.toJSON());
}

async function createCartItem(userId: number, groceryItemId: number, quantity: number) {
    const cartItem = await CartItems.create({ userId, groceryItemId, quantity, deleted: 'false' });
    return cartItem.toJSON();
}

async function deleteTestUsers(userIds: string[]) {
    return await User.destroy({ where: { id: userIds } });
}

async function deleteTestGroceryItems(groceryItemIds: string[]) {
    return await GroceryItems.destroy({ where: { id: groceryItemIds } });
}

async function deleteTestCartItems(cartItemIds: string[]) {
    return await CartItems.destroy({ where: { id: cartItemIds } });
}