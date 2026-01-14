## Cloudflare Dashboard Deployment Guide

Follow these steps to deploy your Minecraft PvP Tracker:

---

## PART 1: Create D1 Database

### 1. Go to D1 Dashboard
Open: https://dash.cloudflare.com/?to=/:account/workers/d1

### 2. Create Database
- Click **"Create database"** button
- Database name: `minecraft-pvp-db`
- Click **"Create"**

### 3. Note the Database ID
- After creation, you'll see the database details
- Copy the **Database ID** (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- Keep this handy - you'll need it!

### 4. Initialize Database Schema
- In the database dashboard, click the **"Console"** tab
- Copy and paste the contents of `schema.sql` into the console
- Click **"Execute"**
- You should see: "8 rows affected" (from the sample data)

**✓ Database created and initialized!**

---

## PART 2: Deploy to Cloudflare Pages

### 1. Go to Pages Dashboard
Open: https://dash.cloudflare.com/?to=/:account/pages

### 2. Create New Project
- Click **"Create application"**
- Choose **"Pages"** tab
- Click **"Upload assets"**

### 3. Upload Project Files
- Project name: `minecraft-pvp-tracker`
- Drag and drop the entire `minecraft-pvp-tracker` folder
  - OR zip the folder and upload the zip file
- Click **"Deploy site"**

**Note:** Make sure you upload:
- `public/` folder (all HTML, CSS, JS files)
- `functions/` folder (API endpoints)

### 4. Wait for Deployment
- Cloudflare will build and deploy your site
- This usually takes 30-60 seconds
- You'll get a URL like: `https://minecraft-pvp-tracker.pages.dev`

**✓ Site deployed!**

---

## PART 3: Connect D1 Database to Pages

### 1. Go to Pages Settings
- Click on your `minecraft-pvp-tracker` project
- Go to **Settings** → **Functions**

### 2. Add D1 Binding
- Scroll to **"D1 database bindings"**
- Click **"Add binding"**
- **Variable name:** `DB` (must be exactly "DB")
- **D1 database:** Select `minecraft-pvp-db`
- Click **"Save"**

### 3. Redeploy
- Go back to **Deployments** tab
- Click the **"⋯"** menu on the latest deployment
- Click **"Retry deployment"**
- OR make any small change and redeploy

**✓ Database connected!**

---

## PART 4: Test Your App

### 1. Visit Your Site
Open your Pages URL: `https://minecraft-pvp-tracker.pages.dev`

### 2. Test Features
- View the dashboard (should show sample data)
- Click "Add Match" and create a new match
- Check if stats update
- Test the chart visualization
- Try CSV export

### 3. If Issues Occur
- Check browser console (F12) for errors
- Verify D1 binding is set correctly
- Make sure database was initialized with schema

---

## Quick Troubleshooting

**Problem: "Database not found" error**
- Solution: Check D1 binding in Settings → Functions
- Make sure variable name is exactly `DB`

**Problem: No data showing**
- Solution: Re-run schema.sql in D1 Console to add sample data

**Problem: API endpoints return 404**
- Solution: Make sure `functions/` folder was uploaded
- Redeploy the site

---

## Your Deployment URLs

- **Dashboard:** https://minecraft-pvp-tracker.pages.dev
- **Add Match:** https://minecraft-pvp-tracker.pages.dev/add.html
- **API Matches:** https://minecraft-pvp-tracker.pages.dev/api/matches
- **API Stats:** https://minecraft-pvp-tracker.pages.dev/api/stats

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Settings → Custom domains → Add domain

2. **Remove Sample Data**
   - D1 Console: `DELETE FROM matches;`

3. **Backup Your Data**
   - D1 Console → Export
   - Or use the CSV export feature in the app

Enjoy your PvP tracker! ⚔️
