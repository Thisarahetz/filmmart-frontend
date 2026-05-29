import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    category: String,
    description: String,
    img: String,
    legalStatus: String,
    platform: { type: [String], default: [] },
    countriesBanned: { type: [String], default: [] },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);

interface RawGame {
  title: string;
  category: string;
  description: string;
  url: string;
  legal_status: string;
  platform: string[];
  countries_banned: string[];
}

const jsonPath = '/Volumes/macSD/macdanlod/game_image_downloader/games_with_urls.json';
const raw: RawGame[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

async function seed() {
  const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
  console.log(`Connecting to ${url} …`);
  await mongoose.connect(url);
  console.log('Connected.\n');

  let upserted = 0;
  let errors = 0;

  for (const entry of raw) {
    if (!entry.title) continue;

    const doc = {
      title: entry.title,
      category: entry.category || undefined,
      description: entry.description || undefined,
      img: entry.url || undefined,
      legalStatus: entry.legal_status || undefined,
      platform: Array.isArray(entry.platform) ? entry.platform : [],
      countriesBanned: Array.isArray(entry.countries_banned) ? entry.countries_banned : [],
    };

    try {
      await Game.findOneAndUpdate(
        { title: doc.title },
        { $set: doc },
        { upsert: true, new: true }
      );
      upserted++;
    } catch (err) {
      console.error(`Failed to upsert "${entry.title}":`, err);
      errors++;
    }
  }

  console.log(`\nUpserted ${upserted} games. Errors: ${errors}.`);

  const count = await Game.countDocuments();
  console.log(`Total games in DB: ${count}`);

  console.log('\nDone!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
