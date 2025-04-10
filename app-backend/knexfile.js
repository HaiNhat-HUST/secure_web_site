// knexfile.js
require('dotenv').config(); // Đọc các biến môi trường từ file .env

module.exports = {
  development: {
    client: 'pg', // Chỉ định client là PostgreSQL
    connection: {
      host: process.env.DB_HOST || 'localhost', // Host của DB (localhost vì map port từ Docker)
      port: parseInt(process.env.DB_PORT || '5432'), // Port DB (port đã map)
      user: process.env.DB_USER || 'db_user',       // User DB từ docker-compose.yml hoặc .env
      password: process.env.DB_PASSWORD || '123456', // Password DB từ docker-compose.yml hoặc .env
      database: process.env.DB_NAME || 'web_db'      // Tên DB từ docker-compose.yml hoặc .env
    },
    pool: { // Cấu hình connection pool (tùy chọn cho dev)
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations', // Thư mục chứa các file migration
      tableName: 'knex_migrations' // Tên bảng Knex dùng để theo dõi migrations (mặc định)
    },
    seeds: {
      directory: './database/seeds' // Thư mục chứa các file seed data
    }
  },

  staging: {
    client: 'pg',
    connection: {
      // Thông tin kết nối cho môi trường Staging (NÊN dùng biến môi trường)
      host: process.env.STAGING_DB_HOST,
      port: parseInt(process.env.STAGING_DB_PORT || '5432'),
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD,
      database: process.env.STAGING_DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations'
    }
    // seeds: { directory: './database/seeds' } // Thường không chạy seed ở staging/prod
  },

  production: {
    client: 'pg',
    connection: {
       // Thông tin kết nối cho môi trường Production (BẮT BUỘC dùng biến môi trường)
       // Có thể dùng connection string thay vì object:
       // connection: process.env.DATABASE_URL + '?ssl=true', // Ví dụ nếu dùng Heroku hoặc cần SSL
      host: process.env.PROD_DB_HOST,
      port: parseInt(process.env.PROD_DB_PORT || '5432'),
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: process.env.PROD_DB_NAME
    },
    pool: {
      min: 2,
      max: 10 // Điều chỉnh dựa trên tải thực tế
    },
    migrations: {
      directory: './database/migrations',
      tableName: 'knex_migrations'
    }
     // seeds: { directory: './database/seeds' } // Thường không chạy seed ở staging/prod
  }
};
