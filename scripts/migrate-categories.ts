/**
 * Re-categorise movies using plot + style keywords.
 * Run: npx tsx scripts/migrate-categories.ts
 */
import mongoose from 'mongoose';
import 'dotenv/config';

// ── Category map: keyword → canonical slug ────────────────────────────────────
// Longer / more-specific phrases must come first (matched before their substrings).
const KEYWORD_TO_CATEGORY: [RegExp, string][] = [
  // Psychological
  [/psychological thriller/i,  'psychological-thriller'],
  [/psychological/i,           'psychological-thriller'],
  [/suspenseful?/i,            'psychological-thriller'],

  // Serial killer / slasher
  [/serial killer/i,           'serial-killer'],
  [/slasher/i,                 'slasher'],
  [/psychopath/i,              'psychopath'],

  // Horror
  [/supernatural/i,            'horror'],
  [/\bscary\b/i,               'horror'],
  [/\bhorror\b/i,              'horror'],
  [/\bgory\b/i,                'horror'],

  // BDSM / Bondage
  [/sadomasochism/i,           'bdsm'],
  [/\bbdsm\b/i,                'bdsm'],
  [/\bbondage\b/i,             'bdsm'],
  [/\bsadism\b/i,              'bdsm'],
  [/\bfetish\b/i,              'fetish'],
  [/domination/i,              'bdsm'],
  [/submission/i,              'bdsm'],

  // Captive / Kidnapping
  [/kidnapping/i,              'captive'],
  [/\bcaptiv/i,                'captive'],   // captive, captivity

  // Voyeur
  [/voyeurism/i,               'voyeur'],
  [/\bvoyeur\b/i,              'voyeur'],

  // Rape & Revenge
  [/rape.and.revenge/i,        'rape-and-revenge'],
  [/revenge/i,                 'revenge'],

  // Sexual violence / abuse
  [/sexualized.violence/i,     'sexual-violence'],
  [/sexual.abuse/i,            'sexual-abuse'],
  [/\brake\b/i,                'sexual-abuse'],

  // Exploitation
  [/sexploitation/i,           'exploitation'],
  [/grindhouse/i,              'exploitation'],
  [/exploitation/i,            'exploitation'],

  // Erotic / Sensual
  [/\berotica\b/i,             'erotic'],
  [/\berotic\b/i,              'erotic'],
  [/\bsexy\b/i,                'erotic'],
  [/\bsensual\b/i,             'erotic'],
  [/sex scene/i,               'erotic'],
  [/\bseduction\b/i,           'erotic'],
  [/\blust\b/i,                'erotic'],
  [/sexual.awakening/i,        'erotic'],
  [/strong.sexual.content/i,   'erotic'],

  // Nudity
  [/female nudity/i,           'nudity'],
  [/male nudity/i,             'nudity'],
  [/\bnudity\b/i,              'nudity'],

  // Lesbian / LGBT
  [/lesbian sex/i,             'lesbian'],
  [/\blesbian\b/i,             'lesbian'],
  [/\blgbt\b/i,                'lgbt'],

  // Incest / Taboo
  [/\bincest\b/i,              'taboo'],
  [/\btaboo\b/i,               'taboo'],

  // Prostitution / Sex work
  [/\bprostitut/i,             'sex-work'],  // prostitute, prostitution
  [/sex.work/i,                'sex-work'],

  // Infidelity / Affairs
  [/\binfidelity\b/i,          'infidelity'],
  [/\baffair\b/i,              'infidelity'],
  [/open.marriage/i,           'infidelity'],
  [/\bswinger/i,               'infidelity'],

  // Obsession / Stalker
  [/\bobsession\b/i,           'obsession'],
  [/\bobsessive\b/i,           'obsession'],
  [/\bstalker\b/i,             'obsession'],

  // Torture
  [/\btorture\b/i,             'torture'],
  [/\bbrutalit/i,              'torture'],

  // Crime / Murder
  [/\bmurder\b/i,              'crime'],
  [/\bcrime\b/i,               'crime'],
  [/\bviolence\b/i,            'crime'],

  // Coming of age
  [/coming.of.age/i,           'coming-of-age'],
  [/\bteenage\b/i,             'coming-of-age'],

  // Disturbing / Dark
  [/\bdisturbing\b/i,          'disturbing'],
  [/\bcontroversial\b/i,       'disturbing'],
  [/\bbleak\b/i,               'disturbing'],
  [/\bdark\b/i,                'disturbing'],

  // Thriller
  [/\bthriller\b/i,            'thriller'],
  [/\bsuspense\b/i,            'thriller'],
  [/\btense\b/i,               'thriller'],
  [/\bdanger\b/i,              'thriller'],

  // Romantic / Love
  [/\bromantic\b/i,            'romance'],
  [/\blove.story/i,            'romance'],

  // Female protagonist
  [/female.protagonist/i,      'female-lead'],
  [/strong.female/i,           'female-lead'],
];

// Human-readable display names for each slug
export const CATEGORY_LABELS: Record<string, string> = {
  'psychological-thriller': 'Psychological Thriller',
  'serial-killer':          'Serial Killer',
  'slasher':                'Slasher',
  'psychopath':             'Psychopath',
  'horror':                 'Horror',
  'bdsm':                   'BDSM',
  'fetish':                 'Fetish',
  'captive':                'Captive',
  'voyeur':                 'Voyeur',
  'rape-and-revenge':       'Rape & Revenge',
  'revenge':                'Revenge',
  'sexual-abuse':           'Sexual Abuse',
  'sexual-violence':        'Sexual Violence',
  'exploitation':           'Exploitation',
  'erotic':                 'Erotic',
  'nudity':                 'Nudity',
  'lesbian':                'Lesbian',
  'lgbt':                   'LGBT',
  'taboo':                  'Taboo',
  'sex-work':               'Sex Work',
  'infidelity':             'Infidelity',
  'obsession':              'Obsession',
  'torture':                'Torture',
  'crime':                  'Crime',
  'coming-of-age':          'Coming of Age',
  'disturbing':             'Disturbing',
  'thriller':               'Thriller',
  'romance':                'Romance',
  'female-lead':            'Female Lead',
};

// ── Extract categories from plot + style text ─────────────────────────────────
function extractCategories(plot: string, style: string): string[] {
  const text = `${plot} ${style}`.toLowerCase();
  const found = new Set<string>();
  for (const [pattern, slug] of KEYWORD_TO_CATEGORY) {
    if (pattern.test(text)) found.add(slug);
  }
  return [...found];
}

// ── Schemas ───────────────────────────────────────────────────────────────────
const MovieSchema = new mongoose.Schema({
  title:  String,
  plot:   String,
  style:  String,
  tags:   [String],
  rating: Number,
}, { strict: false });

const ListSchema = new mongoose.Schema({
  title:   { type: String, required: true, unique: true },
  type:    String,
  genre:   String,
  content: [String],
}, { timestamps: true });

const Movie = mongoose.models.Movies || mongoose.model('Movies', MovieSchema);
const List  = mongoose.models.List   || mongoose.model('List', ListSchema);

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
  console.log(`Connecting to ${url} …`);
  await mongoose.connect(url);
  console.log('Connected.\n');

  const movies = await Movie.find({}).lean();
  console.log(`Processing ${movies.length} movies …`);

  const categoryCount: Record<string, number> = {};
  let updated = 0;

  for (const movie of movies) {
    const derived = extractCategories(movie.plot ?? '', movie.style ?? '');
    if (derived.length === 0) continue;

    // Merge with existing tags (keep originals, add derived)
    const merged = [...new Set([...(movie.tags ?? []), ...derived])];

    await Movie.updateOne({ _id: movie._id }, { $set: { tags: merged } });
    updated++;

    derived.forEach(c => { categoryCount[c] = (categoryCount[c] || 0) + 1; });
  }

  console.log(`Updated tags on ${updated} movies.\n`);
  console.log('Category distribution:');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([slug, count]) => {
      const label = CATEGORY_LABELS[slug] ?? slug;
      console.log(`  ${count.toString().padStart(4)}  ${label}`);
    });

  // Rebuild lists: one per category, sorted by rating desc
  console.log('\nRebuilding category lists …');
  await List.deleteMany({});

  const lists = [];

  // Top Rated list first
  const topRated = await Movie.find({ rating: { $gte: 7 } })
    .sort({ rating: -1 }).limit(20).select('_id').lean();
  lists.push({
    title:   'Top Rated',
    type:    'movie',
    genre:   undefined,
    content: topRated.map((d: { _id: mongoose.Types.ObjectId }) => d._id.toString()),
  });

  // Per-category lists
  for (const [slug, label] of Object.entries(CATEGORY_LABELS)) {
    const docs = await Movie.find({ tags: slug })
      .sort({ rating: -1 }).limit(50).select('_id').lean();
    if (docs.length < 3) continue;
    lists.push({
      title:   label,
      type:    'movie',
      genre:   slug,
      content: docs.map((d: { _id: mongoose.Types.ObjectId }) => d._id.toString()),
    });
  }

  await List.insertMany(lists, { ordered: false });
  console.log(`Inserted ${lists.length} lists.\n`);

  console.log('✅ Category migration complete!');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
