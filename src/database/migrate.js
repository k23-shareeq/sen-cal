const fs = require('fs');
const path = require('path');
const pool = require('./connection');

const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await pool.query(sql);
      console.log(`Migration ${file} executed successfully.`);
    } catch (err) {
      console.error(`Error executing migration ${file}:`, err.message);
      process.exit(1);
    }
  }
  console.log('All migrations executed.');
  process.exit(0);
}

runMigrations(); 