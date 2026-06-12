/**
 * Single source of truth for movie genre/category landing pages.
 *
 * The `slug` doubles as the movie tag used for filtering (see getCategoryMovies)
 * and as the SEO-friendly URL segment: /genre/{slug}.
 *
 * `intro` is an editorial paragraph rendered above the grid and used as the
 * meta-description fallback (first ~160 chars). Edit freely per category.
 */

export interface Category {
  slug: string;
  label: string;
  /** Optional intro paragraph shown on the genre landing page. */
  intro?: string;
}

export const MOVIE_CATEGORIES: Category[] = [
  {
    slug: 'erotic',
    label: 'Erotic',
    intro:
      'Explore our curated collection of erotic cinema — sensual arthouse films and adult dramas that put desire at the centre of the story. Browse ratings, trailers and where to watch each title.',
  },
  {
    slug: 'psychological-thriller',
    label: 'Psychological Thrillers',
    intro:
      'Mind-bending psychological thrillers built on tension, obsession and unreliable narrators. Discover acclaimed and hidden-gem titles, with ratings, trailers and streaming availability.',
  },
  {
    slug: 'bdsm',
    label: 'BDSM',
    intro:
      'Films exploring power, dominance and submission with a serious cinematic eye. Browse BDSM-themed dramas and thrillers, complete with ratings, trailers and where to watch.',
  },
  {
    slug: 'fetish',
    label: 'Fetish',
    intro:
      'A selection of fetish-themed cinema that examines desire, ritual and the unconventional. Find ratings, trailers and streaming options for every title in the collection.',
  },
  {
    slug: 'captive',
    label: 'Captive',
    intro:
      'Tense captivity dramas and abduction thrillers where confinement drives the suspense. Browse the collection with ratings, trailers and where to watch each film.',
  },
  {
    slug: 'voyeur',
    label: 'Voyeur',
    intro:
      'Voyeuristic thrillers and dramas about watching, obsession and the unseen observer. Discover standout titles with ratings, trailers and streaming availability.',
  },
  {
    slug: 'disturbing',
    label: 'Disturbing',
    intro:
      'Provocative and unsettling films that push boundaries and linger long after the credits. Browse disturbing cinema with ratings, trailers and where to watch.',
  },
  {
    slug: 'horror',
    label: 'Horror',
    intro:
      'From slow-burn dread to visceral shocks — explore our horror collection. Find acclaimed and cult titles with ratings, trailers and streaming availability.',
  },
  {
    slug: 'thriller',
    label: 'Thrillers',
    intro:
      'Edge-of-your-seat thrillers packed with suspense, twists and danger. Browse the collection with ratings, trailers and where to watch each title.',
  },
  {
    slug: 'serial-killer',
    label: 'Serial Killer',
    intro:
      'Chilling serial-killer thrillers and true-crime-inspired dramas. Discover gripping titles with ratings, trailers and streaming availability.',
  },
  {
    slug: 'crime',
    label: 'Crime',
    intro:
      'Gritty crime dramas, noir and underworld thrillers. Browse the collection with ratings, trailers and where to watch each film.',
  },
  {
    slug: 'torture',
    label: 'Torture',
    intro:
      'Intense, hard-edged films that confront cruelty and endurance head-on. Browse with ratings, trailers and streaming availability — viewer discretion advised.',
  },
  {
    slug: 'obsession',
    label: 'Obsession',
    intro:
      'Stories of fixation, longing and love taken too far. Explore obsession-driven dramas and thrillers with ratings, trailers and where to watch.',
  },
  {
    slug: 'infidelity',
    label: 'Infidelity',
    intro:
      'Dramas of affairs, betrayal and the fallout of broken trust. Browse infidelity-themed cinema with ratings, trailers and streaming availability.',
  },
  {
    slug: 'lesbian',
    label: 'Lesbian',
    intro:
      'Lesbian romances and dramas centred on women loving women, from tender to intense. Discover acclaimed titles with ratings, trailers and where to watch.',
  },
  {
    slug: 'lgbt',
    label: 'LGBT',
    intro:
      'LGBTQ+ cinema spanning romance, identity and self-discovery. Browse the collection with ratings, trailers and streaming availability.',
  },
  {
    slug: 'nudity',
    label: 'Nudity',
    intro:
      'Films where nudity is integral to the storytelling and artistry. Browse the collection with ratings, trailers and where to watch each title.',
  },
  {
    slug: 'exploitation',
    label: 'Exploitation',
    intro:
      'Bold, provocative exploitation and grindhouse cinema — cult classics and rediscoveries. Find titles with ratings, trailers and streaming availability.',
  },
  {
    slug: 'sexual-abuse',
    label: 'Sexual Abuse',
    intro:
      'Serious dramas that confront sexual abuse, survival and its aftermath with unflinching honesty. Browse with ratings, trailers and where to watch — viewer discretion advised.',
  },
  {
    slug: 'revenge',
    label: 'Revenge',
    intro:
      'Vengeance-fuelled thrillers and dramas where the wronged strike back. Discover the collection with ratings, trailers and streaming availability.',
  },
  {
    slug: 'taboo',
    label: 'Taboo',
    intro:
      'Films that cross lines and explore forbidden subjects with a fearless lens. Browse taboo cinema with ratings, trailers and where to watch each title.',
  },
  {
    slug: 'sex-work',
    label: 'Sex Work',
    intro:
      'Dramas centred on sex work, told with nuance and humanity. Explore the collection with ratings, trailers and streaming availability.',
  },
  {
    slug: 'coming-of-age',
    label: 'Coming of Age',
    intro:
      'Coming-of-age stories of first love, awakening and growing up. Browse the collection with ratings, trailers and where to watch each film.',
  },
  {
    slug: 'romance',
    label: 'Romance',
    intro:
      'Passionate romances from the sweeping to the sensual. Discover acclaimed and hidden-gem love stories with ratings, trailers and streaming availability.',
  },
  {
    slug: 'female-lead',
    label: 'Female Lead',
    intro:
      'Films driven by compelling female protagonists at the heart of the story. Browse the collection with ratings, trailers and where to watch each title.',
  },
];

const BY_SLUG = new Map(MOVIE_CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return BY_SLUG.get(slug);
}
