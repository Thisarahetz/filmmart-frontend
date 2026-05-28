/**
 * Demo seed script — run with:  npx tsx scripts/seed.ts
 *
 * Creates:
 *  - 1 admin user  (admin@filmmart.com / admin123)
 *  - 12 demo movies with ibb.co poster images
 *  - 4 curated lists (Trending, Action, Horror, Series)
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// ── Inline schemas (avoids next.js module resolution issues in a plain script) ─

const MovieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: String,
    img: String,
    imgTitle: String,
    imgSm: String,
    trailer: String,
    video: String,
    year: String,
    limit: Number,
    genre: String,
    isSeries: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ListSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    type: String,
    genre: String,
    content: [String],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Movie = mongoose.models.Movies || mongoose.model('Movies', MovieSchema);
const List = mongoose.models.List || mongoose.model('List', ListSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// ── Movie data (ibb.co poster images) ────────────────────────────────────────

const MOVIES = [
  // ── Action / Superhero
  {
    title: 'Venom (2018)',
    desc: 'Journalist Eddie Brock is trying to take down Carlton Drake, the notorious and brilliant founder of the Life Foundation. While investigating one of Drake\'s experiments, Eddie\'s body merges with the alien Venom — leaving him with superhuman strength and power.',
    img: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    imgSm: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    imgTitle: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    trailer: 'https://www.youtube.com/embed/wuCgt_bbXHs',
    year: '2018',
    limit: 15,
    genre: 'action',
    isSeries: false,
  },
  {
    title: 'Spider-Man: Far From Home',
    desc: 'Following the events of Avengers: Endgame, Spider-Man must step up to take on new threats in a world that has changed forever.',
    img: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    imgSm: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    imgTitle: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    trailer: 'https://www.youtube.com/embed/Nt9L1jCKGnE',
    year: '2019',
    limit: 13,
    genre: 'action',
    isSeries: false,
  },
  {
    title: 'Avengers: Endgame',
    desc: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\'s actions and restore balance to the universe.',
    img: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    imgSm: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    imgTitle: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    trailer: 'https://www.youtube.com/embed/TcMBFSGVi1c',
    year: '2019',
    limit: 13,
    genre: 'action',
    isSeries: false,
  },
  {
    title: 'Interstellar',
    desc: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    img: 'https://i.ibb.co/pZm8M50/37972.jpg',
    imgSm: 'https://i.ibb.co/pZm8M50/37972.jpg',
    imgTitle: 'https://i.ibb.co/pZm8M50/37972.jpg',
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    year: '2014',
    limit: 13,
    genre: 'sci-fi',
    isSeries: false,
  },
  {
    title: 'The Dark Knight',
    desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    img: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    imgSm: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY',
    year: '2008',
    limit: 13,
    genre: 'action',
    isSeries: false,
  },
  {
    title: 'Inception',
    desc: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    img: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    imgSm: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    trailer: 'https://www.youtube.com/embed/YoHD9XEInc0',
    year: '2010',
    limit: 13,
    genre: 'sci-fi',
    isSeries: false,
  },
  // ── Horror
  {
    title: 'It (2017)',
    desc: 'In the summer of 1989, a group of bullied kids band together to destroy a shapeshifting monster, which disguises itself as a clown and preys on the children of Derry, their small Maine town.',
    img: 'https://i.ibb.co/pZm8M50/37972.jpg',
    imgSm: 'https://i.ibb.co/pZm8M50/37972.jpg',
    trailer: 'https://www.youtube.com/embed/FnCdOQsX5kc',
    year: '2017',
    limit: 18,
    genre: 'horror',
    isSeries: false,
  },
  {
    title: 'A Quiet Place',
    desc: 'A family struggles to survive in a post-apocalyptic world inhabited by blind monsters with an acute sense of hearing.',
    img: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    imgSm: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    trailer: 'https://www.youtube.com/embed/WR7cc5t7tv8',
    year: '2018',
    limit: 15,
    genre: 'horror',
    isSeries: false,
  },
  // ── Sci-Fi
  {
    title: 'Dune (2021)',
    desc: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    img: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    imgSm: 'https://i.ibb.co/kDRSfGg/MTRA-com.png',
    trailer: 'https://www.youtube.com/embed/8g18jFHCLXk',
    year: '2021',
    limit: 13,
    genre: 'sci-fi',
    isSeries: false,
  },
  // ── Series
  {
    title: 'Breaking Bad',
    desc: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    img: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    imgSm: 'https://i.ibb.co/FHShpGv/58-589476-official-venom-movie-poster.jpg',
    trailer: 'https://www.youtube.com/embed/HhesaQXLuRY',
    year: '2008',
    limit: 18,
    genre: 'crime',
    isSeries: true,
  },
  {
    title: 'Stranger Things',
    desc: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    img: 'https://i.ibb.co/pZm8M50/37972.jpg',
    imgSm: 'https://i.ibb.co/pZm8M50/37972.jpg',
    trailer: 'https://www.youtube.com/embed/b9EkMc79ZSU',
    year: '2016',
    limit: 16,
    genre: 'horror',
    isSeries: true,
  },
  {
    title: 'The Witcher',
    desc: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    img: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    imgSm: 'https://i.ibb.co/v1MXJ2B/images.jpg',
    trailer: 'https://www.youtube.com/embed/ndl7gRDMECg',
    year: '2019',
    limit: 18,
    genre: 'fantasy',
    isSeries: true,
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  const url = process.env.MONGO_URL ?? 'mongodb://localhost:27017/filmmart';
  console.log(`Connecting to ${url} …`);
  await mongoose.connect(url);
  console.log('Connected.\n');

  // Wipe existing demo data
  await Promise.all([Movie.deleteMany({}), List.deleteMany({}), User.deleteMany({})]);
  console.log('Cleared existing data.');

  // Insert movies
  const inserted = await Movie.insertMany(MOVIES);
  console.log(`Inserted ${inserted.length} movies.`);

  // Map title → _id for list building
  const byTitle = Object.fromEntries(inserted.map((m) => [m.title, m._id.toString()]));

  // Build lists
  const lists = [
    {
      title: 'Trending Now',
      type: undefined,
      genre: undefined,
      content: [
        byTitle['Venom (2018)'],
        byTitle['Avengers: Endgame'],
        byTitle['Interstellar'],
        byTitle['Dune (2021)'],
        byTitle['Stranger Things'],
      ],
    },
    {
      title: 'Action & Adventure',
      type: 'movie',
      genre: 'action',
      content: [
        byTitle['Venom (2018)'],
        byTitle['Spider-Man: Far From Home'],
        byTitle['Avengers: Endgame'],
        byTitle['The Dark Knight'],
        byTitle['Inception'],
      ],
    },
    {
      title: 'Horror Picks',
      type: 'movie',
      genre: 'horror',
      content: [
        byTitle['It (2017)'],
        byTitle['A Quiet Place'],
      ],
    },
    {
      title: 'Top Series',
      type: 'series',
      genre: undefined,
      content: [
        byTitle['Breaking Bad'],
        byTitle['Stranger Things'],
        byTitle['The Witcher'],
      ],
    },
  ];

  await List.insertMany(lists);
  console.log(`Inserted ${lists.length} lists.`);

  // Admin user
  const hashed = await bcrypt.hash('admin123', 12);
  await User.create({
    username: 'admin',
    email: 'admin@filmmart.com',
    password: hashed,
    isAdmin: true,
  });
  console.log('Created admin user.');

  console.log('\n✅ Seed complete!\n');
  console.log('  Admin login  →  admin@filmmart.com / admin123');
  console.log('  App          →  http://localhost:3001\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
