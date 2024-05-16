import { fileURLToPath } from 'url'
import cp from 'child_process'
import shift from 'postgres-shift'
import sql from "../db.js";

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
    .then(() => console.log('Migration finished'))
    .catch(err => {
      console.error('Failed', err.message)
      //process.exit(1)
    })
  } catch (error) {
    console.log(error.message)
  }
}

export default migrateDatabse