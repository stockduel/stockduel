
//two modes to swap between depending on if the environment variable is set (see db/knexfile.js)
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
