export const createPasswordHash = (password: string): string => {
    return Buffer.from(password).toString('base64');
};

export const generateToken = (): string => {
    return Math.random().toString(36).substring(2);
};