// API endpoint for statistics
// GET /api/stats - Get match statistics

export async function onRequestGet(context) {
    try {
        const { DB } = context.env;
        const url = new URL(context.request.url);
        const startDate = url.searchParams.get('start_date');
        const endDate = url.searchParams.get('end_date');

        let whereClause = '';
        const params = [];

        // Add date filtering if provided
        if (startDate && endDate) {
            whereClause = ' WHERE timestamp BETWEEN ? AND ?';
            params.push(startDate, endDate);
        } else if (startDate) {
            whereClause = ' WHERE timestamp >= ?';
            params.push(startDate);
        } else if (endDate) {
            whereClause = ' WHERE timestamp <= ?';
            params.push(endDate);
        }

        // Get total counts by result
        const countsQuery = `
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
                SUM(CASE WHEN result = 'inconclusive' THEN 1 ELSE 0 END) as inconclusive
            FROM matches${whereClause}
        `;

        const counts = await DB.prepare(countsQuery).bind(...params).first();

        // Calculate win percentage
        const winPercentage = counts.total > 0
            ? ((counts.wins / counts.total) * 100).toFixed(1)
            : 0;

        // Get streak calculation
        const streakQuery = `
            SELECT result, timestamp
            FROM matches${whereClause}
            ORDER BY timestamp DESC
        `;

        const { results: recentMatches } = await DB.prepare(streakQuery).bind(...params).all();

        let currentStreak = 0;
        let streakType = null;

        if (recentMatches.length > 0) {
            const firstResult = recentMatches[0].result;
            if (firstResult !== 'inconclusive') {
                streakType = firstResult;
                for (const match of recentMatches) {
                    if (match.result === firstResult) {
                        currentStreak++;
                    } else if (match.result !== 'inconclusive') {
                        break;
                    }
                }
            }
        }

        // Get daily stats for chart
        const dailyStatsQuery = `
            SELECT
                DATE(timestamp) as date,
                SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
                SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
                COUNT(*) as total
            FROM matches${whereClause}
            GROUP BY DATE(timestamp)
            ORDER BY date ASC
        `;

        const { results: dailyStats } = await DB.prepare(dailyStatsQuery).bind(...params).all();

        // Calculate cumulative wins and losses for chart
        let cumulativeWins = 0;
        let cumulativeLosses = 0;
        const chartData = dailyStats.map(day => {
            cumulativeWins += day.wins;
            cumulativeLosses += day.losses;
            return {
                date: day.date,
                wins: day.wins,
                losses: day.losses,
                cumulativeWins,
                cumulativeLosses,
                winRate: cumulativeWins > 0
                    ? ((cumulativeWins / (cumulativeWins + cumulativeLosses)) * 100).toFixed(1)
                    : 0
            };
        });

        return new Response(JSON.stringify({
            total: counts.total,
            wins: counts.wins,
            losses: counts.losses,
            inconclusive: counts.inconclusive,
            winPercentage,
            currentStreak,
            streakType,
            chartData
        }), {
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
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
