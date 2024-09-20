import { sql } from '@vercel/postgres';
import { ThreadTable } from './definitions';

export async function fetchThreads() {
  try {
    const result = await sql<ThreadTable>`
    SELECT * FROM ThreadTable
  `;

  // Access the rows property to get the actual data
  const data = result.rows.map((thread)=>(
    {
      ...thread
    }
  ))

  return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest threads.');
  }
}
