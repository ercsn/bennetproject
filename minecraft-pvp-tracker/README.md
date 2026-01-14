# Minecraft PvP Stats Tracker

A simple, single-user web app for tracking Minecraft PvP match results. Built with Cloudflare Pages, Pages Functions, and D1 (SQLite).

## Features

- **Battle Entry**: Quickly record PvP matches with opponent name, result (win/loss/inconclusive), timestamp, and notes
- **Statistics Dashboard**: View total matches, win/loss counts, win percentage, and current streaks
- **Data Visualization**: Chart.js powered graphs showing win rate and cumulative stats over time
- **Date Filtering**: Filter dashboard statistics by date range
- **CSV Export**: Export all match data to CSV format
- **Responsive Design**: Works on desktop and mobile devices
- **Fast Data Entry**: Large result buttons and keyboard shortcuts (W/L/I) for quick entry

## Project Structure

```
minecraft-pvp-tracker/
├── functions/
│   └── api/
│       ├── matches.js      # CRUD operations for matches
│       └── stats.js         # Statistics and analytics endpoints
├── public/
│   ├── index.html          # Dashboard page
│   ├── add.html            # Battle entry form
│   ├── style.css           # Shared styles
│   ├── dashboard.js        # Dashboard logic
│   └── add.js              # Form handling
├── schema.sql              # D1 database schema
├── wrangler.toml           # Cloudflare configuration
└── README.md
```

## Database Schema

The app uses a single `matches` table:

```sql
CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    opponent_name TEXT NOT NULL,
    result TEXT NOT NULL CHECK(result IN ('win', 'loss', 'inconclusive')),
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);
```

## API Endpoints

### GET /api/matches
Retrieve matches with optional filtering.

**Query Parameters:**
- `limit` - Number of matches to return (default: 50)
- `start_date` - Filter matches from this date
- `end_date` - Filter matches until this date

**Response:**
```json
[
  {
    "id": 1,
    "timestamp": "2024-01-13T12:00:00Z",
    "opponent_name": "ShadowNinja",
    "result": "win",
    "notes": "Great fight in the arena"
  }
]
```

### POST /api/matches
Create a new match record.

**Request Body:**
```json
{
  "opponent_name": "DragonSlayer99",
  "result": "win",
  "timestamp": "2024-01-13T12:00:00Z",  // Optional, defaults to now
  "notes": "Epic battle"                 // Optional
}
```

**Response:**
```json
{
  "success": true,
  "id": 42
}
```

### GET /api/stats
Get aggregated statistics and chart data.

**Query Parameters:**
- `start_date` - Filter stats from this date
- `end_date` - Filter stats until this date

**Response:**
```json
{
  "total": 100,
  "wins": 65,
  "losses": 30,
  "inconclusive": 5,
  "winPercentage": "65.0",
  "currentStreak": 5,
  "streakType": "win",
  "chartData": [
    {
      "date": "2024-01-13",
      "wins": 3,
      "losses": 1,
      "cumulativeWins": 65,
      "cumulativeLosses": 30,
      "winRate": "68.4"
    }
  ]
}
```

## Deployment Instructions

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and npm
2. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/):
   ```bash
   npm install -g wrangler
   ```
3. Authenticate with Cloudflare:
   ```bash
   wrangler login
   ```

### Step 1: Create D1 Database

```bash
cd minecraft-pvp-tracker

# Create the database
wrangler d1 create minecraft-pvp-db
```

Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "minecraft-pvp-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your database ID
```

### Step 2: Initialize Database Schema

```bash
# Run the schema migration
wrangler d1 execute minecraft-pvp-db --file=./schema.sql
```

This will create the `matches` table and insert sample data.

### Step 3: Test Locally

```bash
# Start local development server
wrangler pages dev public
```

Visit `http://localhost:8788` to test the app locally.

### Step 4: Deploy to Cloudflare Pages

```bash
# Deploy to Cloudflare Pages
wrangler pages deploy public --project-name=minecraft-pvp-tracker
```

Or deploy via the Cloudflare Dashboard:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
2. Click "Create a project"
3. Connect your Git repository or upload files directly
4. Set build settings:
   - Build command: (leave empty)
   - Build output directory: `public`
5. Add environment variables:
   - Go to Settings → Functions → D1 database bindings
   - Add binding: `DB` → `minecraft-pvp-db`
6. Deploy!

### Step 5: Configure D1 Binding (Dashboard Method)

If deploying via dashboard:

1. Go to your Pages project → Settings → Functions
2. Scroll to "D1 database bindings"
3. Click "Add binding"
4. Variable name: `DB`
5. D1 database: Select `minecraft-pvp-db`
6. Save

## Local Development

```bash
# Install dependencies (if any added later)
npm install

# Start local dev server with D1 binding
wrangler pages dev public --d1 DB=minecraft-pvp-db

# Execute SQL commands locally
wrangler d1 execute minecraft-pvp-db --local --file=./schema.sql

# Query database locally
wrangler d1 execute minecraft-pvp-db --local --command="SELECT * FROM matches"
```

## Usage Tips

### Quick Match Entry

1. Navigate to "Add Match" page
2. Enter opponent name
3. Click result button (or press W/L/I on keyboard)
4. Optionally add notes
5. Click "Save Match"

The form auto-resets for rapid entry of multiple matches.

### Keyboard Shortcuts

On the Add Match page:
- `W` - Select Win
- `L` - Select Loss
- `I` - Select Inconclusive

### Filtering Stats

Use the date range filter on the dashboard to:
- View stats for a specific time period
- Compare performance across different weeks/months
- Analyze recent performance trends

### Exporting Data

Click "Export CSV" on the dashboard to download all matches as a CSV file for:
- Backup purposes
- Analysis in spreadsheet software
- Sharing with friends

## Customization

### Changing Colors

Edit `public/style.css` to customize the color scheme. Key variables:
- Primary color: `#667eea` (purple)
- Win color: `#10b981` (green)
- Loss color: `#ef4444` (red)

### Adding Fields

To add custom fields (e.g., "map name", "weapon used"):

1. Update database schema in `schema.sql`
2. Add migration:
   ```sql
   ALTER TABLE matches ADD COLUMN map_name TEXT;
   ```
3. Update API in `functions/api/matches.js`
4. Update forms in `public/add.html` and `public/add.js`

### Chart Customization

Edit the Chart.js configuration in `public/dashboard.js` (function `renderChart`) to:
- Change chart type (line, bar, pie)
- Add more datasets
- Customize colors and styling
- Adjust scales and axes

## Troubleshooting

### Database not found

Make sure:
1. D1 database is created: `wrangler d1 list`
2. Database ID in `wrangler.toml` matches
3. D1 binding is configured in Pages settings

### Functions not working

1. Check that files are in `functions/api/` directory
2. Verify Pages Functions are enabled in project settings
3. Check browser console for API errors

### Local development issues

1. Use `wrangler pages dev` instead of a simple HTTP server
2. Ensure you're using the `--d1` flag for local D1 access
3. Check Wrangler is up to date: `npm install -g wrangler@latest`

## License

MIT License - Feel free to use and modify for your own purposes!

## Contributing

This is a simple single-user app. Feel free to fork and customize to your needs!

## Future Enhancements

Ideas for extending the app:
- Multi-user support with authentication
- Team/clan tracking
- Arena/map statistics
- Player rankings and leaderboards
- Discord webhook notifications
- Advanced analytics (time of day patterns, opponent analysis)
- Match replay/screenshot uploads
