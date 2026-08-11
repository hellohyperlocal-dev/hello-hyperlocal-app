import { InterestScoreResult, PersonaId, QuizAnswers } from './mock-data';

interface PersonaSignal {
  label: string;
  weight: 1 | 2;
}

export const PERSONA_SIGNALS: Record<PersonaId, PersonaSignal[]> = {
  coffee_lover: [
    { label: 'Coffee Shops', weight: 2 },
    { label: 'Coffee', weight: 2 },
    { label: 'Working from Cafés', weight: 1 },
  ],
  food_explorer: [
    { label: 'Restaurants', weight: 2 },
    { label: 'Bakeries', weight: 2 },
    { label: 'Wine', weight: 1 },
    { label: 'Craft Beer', weight: 1 },
    { label: 'Bars', weight: 1 },
    { label: 'Food Specials', weight: 1 },
    { label: 'Eating Out', weight: 2 },
    { label: 'Restaurant Openings', weight: 1 },
    { label: 'Food', weight: 2 },
    { label: 'Markets', weight: 1 },
    { label: 'Local Markets', weight: 1 },
    { label: 'Markets & Festivals', weight: 1 },
  ],
  shop_local_supporter: [
    { label: 'Fashion', weight: 1 },
    { label: 'Home Décor', weight: 1 },
    { label: 'Gifts', weight: 1 },
    { label: 'Local Markets', weight: 2 },
    { label: 'Shopping', weight: 2 },
    { label: 'New Businesses', weight: 1 },
    { label: 'Specials & Discounts', weight: 2 },
    { label: 'Business Specials', weight: 1 },
    { label: 'Recommended Businesses', weight: 2 },
    { label: 'Local Deals', weight: 1 },
    { label: 'Review Businesses', weight: 1 },
    { label: 'Recommend Places', weight: 1 },
    { label: 'Save money with local offers', weight: 2 },
  ],
  outdoor_enthusiast: [
    { label: 'Hiking', weight: 2 },
    { label: 'Cycling', weight: 2 },
    { label: 'Running', weight: 1 },
    { label: 'Gardening', weight: 1 },
    { label: 'Parks', weight: 2 },
    { label: 'Walking', weight: 2 },
    { label: 'Hidden Gems', weight: 1 },
    { label: 'New Places', weight: 1 },
    { label: 'Explore my neighbourhood', weight: 2 },
  ],
  family_first: [
    { label: 'Children', weight: 2 },
    { label: 'Teenagers', weight: 1 },
    { label: 'Seniors', weight: 1 },
    { label: 'Family Activities', weight: 2 },
    { label: 'Kids Events', weight: 2 },
    { label: 'Play Areas', weight: 1 },
    { label: 'Schools', weight: 1 },
    { label: 'Holiday Activities', weight: 1 },
    { label: 'Family Time', weight: 2 },
    { label: 'Keep my family informed', weight: 2 },
  ],
  pet_lover: [
    { label: 'Pets', weight: 2 },
    { label: 'Animal Welfare', weight: 2 },
  ],
  culture_seeker: [
    { label: 'Art', weight: 1 },
    { label: 'Photography', weight: 1 },
    { label: 'Music', weight: 1 },
    { label: 'Theatre', weight: 2 },
    { label: 'Live Entertainment', weight: 2 },
    { label: 'Local History', weight: 2 },
    { label: 'Live Music', weight: 2 },
    { label: 'Community Stories', weight: 1 },
    { label: 'Local Heroes', weight: 1 },
    { label: 'Events', weight: 1 },
    { label: 'Weekend Events', weight: 1 },
    { label: 'Markets & Festivals', weight: 1 },
  ],
  active_lifestyle: [
    { label: 'Gyms', weight: 2 },
    { label: 'Yoga', weight: 2 },
    { label: 'Running', weight: 2 },
    { label: 'Cycling', weight: 1 },
    { label: 'Fitness', weight: 2 },
    { label: 'Wellness', weight: 1 },
    { label: 'Sports Clubs', weight: 1 },
  ],
  community_builder: [
    { label: 'Local News', weight: 1 },
    { label: 'Safety Alerts', weight: 1 },
    { label: 'Community Meetings', weight: 2 },
    { label: 'Volunteer Opportunities', weight: 2 },
    { label: 'Charity Events', weight: 2 },
    { label: 'Community News', weight: 1 },
    { label: 'Road Closures', weight: 1 },
    { label: 'Water & Power Outages', weight: 1 },
    { label: 'Security Alerts', weight: 1 },
    { label: 'Lost & Found', weight: 1 },
    { label: 'Residents Association', weight: 2 },
    { label: 'Security Company', weight: 1 },
    { label: 'CPF', weight: 2 },
    { label: 'Community Projects', weight: 2 },
    { label: 'Churches', weight: 1 },
    { label: 'Visiting Friends', weight: 1 },
    { label: 'Emergency Alerts', weight: 1 },
    { label: 'Weather Warnings', weight: 1 },
    { label: 'Report Issues', weight: 2 },
    { label: 'Volunteer', weight: 2 },
    { label: 'Join Community Projects', weight: 2 },
    { label: 'Submit Events', weight: 1 },
    { label: 'Stay informed', weight: 2 },
    { label: 'Meet my community', weight: 2 },
    { label: 'Support local', weight: 1 },
  ],
  local_entrepreneur: [
    { label: 'Business Owner', weight: 2 },
    { label: 'Property Owner', weight: 1 },
    { label: 'Networking', weight: 2 },
    { label: 'Business News', weight: 2 },
    { label: 'Job Opportunities', weight: 1 },
    { label: 'Property', weight: 1 },
    { label: 'Investments', weight: 2 },
    { label: 'Local Services', weight: 1 },
    { label: 'Promote My Business', weight: 2 },
    { label: 'Sell Items', weight: 1 },
    { label: 'Promote my business', weight: 2 },
    { label: 'Business Specials', weight: 1 },
  ],
};

const TOP_PERSONA_SCORE_THRESHOLD = 30;
const MAX_TOP_PERSONAS = 3;

function flattenSelectedLabels(answers: QuizAnswers): string[] {
  const singles = [answers.role, answers.ageGroup, answers.joinReason].filter(
    (value): value is string => !!value
  );
  const lists = [
    answers.household,
    answers.interests,
    answers.hearAbout,
    answers.organisations,
    answers.weekendActivities,
    answers.feedPreferences,
    answers.notificationPreferences,
    answers.participation,
  ];
  return [...singles, ...lists.flat()];
}

export function countSelectedAnswers(answers: QuizAnswers): number {
  return flattenSelectedLabels(answers).length;
}

export function scoreAnswers(answers: QuizAnswers): InterestScoreResult {
  const selectedLabels = new Set(flattenSelectedLabels(answers));

  const scores = {} as Record<PersonaId, number>;
  for (const personaId of Object.keys(PERSONA_SIGNALS) as PersonaId[]) {
    const signals = PERSONA_SIGNALS[personaId];
    const max = signals.reduce((sum, signal) => sum + signal.weight, 0);
    const raw = signals.reduce(
      (sum, signal) => sum + (selectedLabels.has(signal.label) ? signal.weight : 0),
      0
    );
    scores[personaId] = max > 0 ? Math.round((raw / max) * 100) : 0;
  }

  const ranked = (Object.keys(scores) as PersonaId[]).sort((a, b) => scores[b] - scores[a]);

  let topPersonas: PersonaId[] = [];
  if (scores[ranked[0]] > 0) {
    topPersonas = ranked
      .filter((id, index) => index === 0 || scores[id] >= TOP_PERSONA_SCORE_THRESHOLD)
      .slice(0, MAX_TOP_PERSONAS);
  } else {
    topPersonas = ['community_builder'];
  }

  return { scores, topPersonas };
}
