// API endpoint for managing matches
// GET /api/matches - List all matches
// POST /api/matches - Create a new match

export async function onRequestGet(context) {
    try {
        const { DB } = context.env;
        const url = new URL(context.request.url);
        const limit = url.searchParams.get('limit') || '50';
        const startDate = url.searchParams.get('start_date');
        const endDate = url.searchParams.get('end_date');

        let query = 'SELECT * FROM matches';
        const params = [];

        // Add date filtering if provided
        if (startDate && endDate) {
            query += ' WHERE timestamp BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            query += ' WHERE timestamp >= ?';
            params.push(startDate);
        } else if (endDate) {
            query += ' WHERE timestamp <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY timestamp DESC LIMIT ?';
        params.push(parseInt(limit));

        const { results } = await DB.prepare(query).bind(...params).all();

        return new Response(JSON.stringify(results), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    try {
        const { DB } = context.env;
        const body = await context.request.json();

        const { opponent_name, result, timestamp, notes } = body;

        // Validate required fields
        if (!opponent_name || !result) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate result enum
        if (!['win', 'loss', 'inconclusive'].includes(result)) {
            return new Response(JSON.stringify({ error: 'Invalid result value' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Use provided timestamp or default to now
        const matchTimestamp = timestamp || new Date().toISOString();

        const query = `
            INSERT INTO matches (timestamp, opponent_name, result, notes)
            VALUES (?, ?, ?, ?)
        `;

        const result_obj = await DB.prepare(query)
            .bind(matchTimestamp, opponent_name, result, notes || null)
            .run();

        return new Response(JSON.stringify({
            success: true,
            id: result_obj.meta.last_row_id
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
