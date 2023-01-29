export default () => ({
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_USER : process.env.POSTGRES_USER,
    POSTGRES_PASSWORD : process.env.POSTGRES_PASSWORD,
    POSTGRES_HOST : process.env.POSTGRES_HOST,
    POSTGRES_PORT : parseInt(process.env.POSTGRES_PORT),

    NESTJS_PORT : parseInt(process.env.NESTJS_PORT),
    NESTJS_UID : process.env.NESTJS_UID,
    NESTJS_SECRET : process.env.NESTJS_SECRET,
    NESTJS_OAUTH_URL : process.env.NESTJS_OAUTH_URL,
    NESTJS_REDIRECT_URL : process.env.NESTJS_REDIRECT_URL,
    NESTJS_SESSION_ID : process.env.NESTJS_SESSION_ID,
});