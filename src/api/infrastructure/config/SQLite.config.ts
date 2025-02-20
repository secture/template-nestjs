import knex, { Knex } from 'knex';

export const createSQLiteConnection = (filename: string): Knex => {
  return knex({
    client: 'better-sqlite3',
    connection: {
      filename: filename,
    },
    useNullAsDefault: true,
  });
};
