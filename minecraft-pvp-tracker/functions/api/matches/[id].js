// API endpoint for individual match operations
// DELETE /api/matches/[id] - Delete a specific match

export async function onRequestDelete(context) {
    try {
        const { DB } = context.env;
        const matchId = context.params.id;

        if (!matchId) {
            return new Response(JSON.stringify({ error: 'Match ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const query = 'DELETE FROM matches WHERE id = ?';
        await DB.prepare(query).bind(matchId).run();

        return new Response(JSON.stringify({ success: true }), {
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
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
