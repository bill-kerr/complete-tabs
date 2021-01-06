export const config = Object.freeze({
  NODE_ENV: (process.env.NODE_ENV || 'development').toLowerCase(),

  CLEAR_DB_ON_START:
    process.env.NODE_ENV?.toLowerCase() === 'development' &&
    process.env.CLEAR_DB_ON_START === 'true',

  PORT: parseInt(process.env.PORT || '3333', 10),

  PG_CONN_STRING: process.env.PG_CONN_STRING || '',

  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
});
