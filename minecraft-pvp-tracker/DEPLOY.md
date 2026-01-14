# Quick Deployment Guide

## 1. Create D1 Database

```bash
cd minecraft-pvp-tracker
wrangler d1 create minecraft-pvp-db
```

Copy the `database_id` from the output.

## 2. Update wrangler.toml

Replace `your-database-id-here` in `wrangler.toml` with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "minecraft-pvp-db"
database_id = "abc123-your-actual-id-xyz"  # ← Update this
```

## 3. Initialize Database

```bash
wrangler d1 execute minecraft-pvp-db --file=./schema.sql
```

## 4. Test Locally

```bash
wrangler pages dev public
```

Visit http://localhost:8788

## 5. Deploy to Cloudflare Pages

### Option A: Command Line

```bash
wrangler pages deploy public --project-name=minecraft-pvp-tracker
```

### Option B: Dashboard

1. Go to https://dash.cloudflare.com/ → Pages
2. Click "Create a project" → "Upload assets"
3. Upload the `public` folder
4. After deployment:
   - Go to Settings → Functions → D1 database bindings
   - Add binding: Variable name = `DB`, D1 database = `minecraft-pvp-db`
   - Save and redeploy

## 6. Done!

Your app is now live at: `https://minecraft-pvp-tracker.pages.dev`

## Useful Commands

```bash
# View database contents
wrangler d1 execute minecraft-pvp-db --command="SELECT * FROM matches"

# Add data manually
wrangler d1 execute minecraft-pvp-db --command="INSERT INTO matches (timestamp, opponent_name, result, notes) VALUES (datetime('now'), 'TestPlayer', 'win', 'Test match')"

# Local development
wrangler pages dev public

# Deploy updates
wrangler pages deploy public
```

## Troubleshooting

**Issue:** "Database not found"
- Run: `wrangler d1 list` to verify database exists
- Check `wrangler.toml` has correct database_id

**Issue:** "Functions not working"
- Verify D1 binding is configured in Pages dashboard
- Check Functions are in `functions/api/` directory

**Issue:** "CORS errors"
- This shouldn't happen with Pages Functions
- Check browser console for specific error messages
