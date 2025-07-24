const typeorm = require('typeorm');
require('dotenv').config();

console.log(process.env.DB_NAME);
console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);
module.exports = new typeorm.DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/**/**.migration{.ts,.js}'],
  synchronize: false,
});
