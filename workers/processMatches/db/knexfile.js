module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: "127.0.0.1",
      database: 'stockduel'
    }
  },
  deployment: {
    client: 'postgresql',
    connection: {
      host: "127.0.0.1",
      database: 'stockduel',
      user: 'postgres',
      password: 'postgres'
    }
  }
};
