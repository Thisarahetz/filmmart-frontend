/**
 * Convert game categories → game lists.
 *
 * For every distinct category in the games collection this script creates
 * a List document (type: 'game') whose content is the IDs of all games in
 * that category.  Existing lists with the same title are skipped.
 *
 * Usage:
 *   npx tsx scripts/seed-game-lists.ts
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
config({ path: '.env.local' });
config();

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';

const GameSchema = new mongoose.Schema({ title: String, category: String }, { strict: false });
const ListSchema = new mongoose.Schema(
  { title: { type: String, unique: true }, type: String, content: [String] },
  { strict: false, timestamps: true }
);

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
const List = mongoose.models.List || mongoose.model('List', ListSchema);

async function run() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to', MONGO_URL, '\n');

  const categories: string[] = await Game.distinct('category');
  const valid = categories.filter(Boolean).sort();
  console.log(`Found ${valid.length} categories.\n`);

  let created = 0, skipped = 0;

  for (const category of valid) {
    const existing = await List.findOne({ title: category });
    if (existing) {
      console.log(`  skip  "${category}"`);
      skipped++;
      continue;
    }

    const games = await Game.find({ category }).select('_id').lean() as { _id: mongoose.Types.ObjectId }[];
    const content = games.map((g) => String(g._id));

    await List.create({ title: category, type: 'game', content });
    console.log(`  ✓  "${category}"  (${content.length} games)`);
    created++;
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  created=${created}  skipped=${skipped}`);
  console.log(`─────────────────────────────────────────\n`);

  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
