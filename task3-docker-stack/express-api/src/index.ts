import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize database table
async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS stats (
        id SERIAL PRIMARY KEY,
        requests_made INTEGER DEFAULT 0,
        tokens_used INTEGER DEFAULT 0,
        active_connections INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert initial data if table is empty
    const result = await client.query('SELECT COUNT(*) FROM stats');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO stats (requests_made, tokens_used, active_connections)
        VALUES (1247, 58432, 23)
      `);
    }
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get stats from PostgreSQL
app.get('/api/stats', async (_req: Request, res: Response) => {
  try {
    // Update stats with random increments (simulating live data)
    const requestsIncrement = Math.floor(Math.random() * 5) + 1;
    const tokensIncrement = Math.floor(Math.random() * 150) + 50;
    const connectionChange = Math.floor(Math.random() * 7) - 3;

    const result = await pool.query(`
      UPDATE stats
      SET
        requests_made = requests_made + $1,
        tokens_used = tokens_used + $2,
        active_connections = GREATEST(5, LEAST(50, active_connections + $3))
      WHERE id = 1
      RETURNING requests_made, tokens_used, active_connections
    `, [requestsIncrement, tokensIncrement, connectionChange]);

    const stats = result.rows[0];
    res.json({
      requestsMade: stats.requests_made,
      tokensUsed: stats.tokens_used,
      activeConnections: stats.active_connections,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all data
app.get('/api/data', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM stats ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Insert data
app.post('/api/data', async (req: Request, res: Response) => {
  try {
    const { requests_made, tokens_used, active_connections } = req.body;
    const result = await pool.query(`
      INSERT INTO stats (requests_made, tokens_used, active_connections)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [requests_made || 0, tokens_used || 0, active_connections || 0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

// Start server
async function start() {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Express API server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
