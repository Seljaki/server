import { fileURLToPath } from 'url'
import cp from 'child_process'
import shift from 'postgres-shift'
import sql from "../db.js";
import { createUser } from '../utils/user.js';

async function migrateDatabse() {
  console.log("Migration")
  try {
    shift({
      sql,
      path: fileURLToPath(new URL('migrations', import.meta.url)),
      before: ({
        migration_id,
        name
      }) => {
        console.log('Migrating', migration_id, name)
      },
      after: async () => {

      }
    })
    .then(async () => {
      console.log('Migration finished')
      const users = await sql`SELECT * FROM users`
      if(users.length === 0)
        createUser('admin', 'admin', null).catch(e => console.log(e))
    })
    .catch(err => {
      console.error('Failed', err.message)
      //process.exit(1)
    })
  } catch (error) {
    console.log(error.message)
  }
}

export default migrateDatabse