// config.d.ts
export declare module './../config/config' {
    interface Config {
        username: string;
        password: string;
        database: string;
        host: string;
        dialect: string;
    }

    const config: Config;
    export default config;
}
