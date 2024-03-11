export type User = {
    id?: string;
    username: string;
    password: string;
    email: string;
    role: string;
    token?: string;
};

export type GroceryItem = {
    name: string;
    quantity: number;
    price: number;
    deleted: string;
    userId: number;
};

export type CartItem = {
    userId: string;
    groceryItemId: string;
    quantity: number;
    deleted: string;
};