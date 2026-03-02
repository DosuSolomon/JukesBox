const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'Sulaimon_d03111991',
  database: 'postgres'
});

client.connect()
  .then(() => client.query('CREATE DATABASE jukesbox'))
  .then(() => {
    console.log('Database "jukesbox" created successfully!');
    client.end();
  })
  .catch(e => {
    console.error(e.message);
    client.end();
  });
