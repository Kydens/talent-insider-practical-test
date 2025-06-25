// crud dilakukan dengan query pg
const insertTransaction = async (client, table, data, returning = '*') => {
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING ${returning}`;

    const result = await client.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error(`Error inserting data ${table}: `, error.message);
    throw error;
  }
};

const updateTransaction = async (
  client,
  table,
  data,
  where,
  returning = '*'
) => {
  try {
    const setClause = Object.keys(data)
      .map((key, i) => `${key} = $${i + 1}`)
      .join(', ');

    const whereClause = Object.key(where)
      .map((key, i) => `${key} = $${i + Object.keys(data).length + 1}`)
      .join(' AND ');

    const values = [...Object.values(data), ...Object.values(where)];

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING ${returning};`;

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating data ${table}: `, error.message);
    throw error;
  }
};

module.exports = {
  insertTransaction,
  updateTransaction,
};
