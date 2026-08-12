import { QuizAnswers } from './mock-data';

interface QuizStepMeta {
  id: string;
  eyebrow: string;
  question: string;
  subtitle?: string;
}

export interface QuizGroup {
  groupLabel: string;
  options: string[];
}

export interface SingleSelectStep extends QuizStepMeta {
  kind: 'single';
  field: keyof QuizAnswers;
  options: string[];
}

export interface MultiSelectStep extends QuizStepMeta {
  kind: 'multi';
  field: keyof QuizAnswers;
  options: string[];
}

export interface MultiGroupedStep extends QuizStepMeta {
  kind: 'multi-grouped';
  field: keyof QuizAnswers;
  groups: QuizGroup[];
}

export interface ComboSubQuestion {
  field: keyof QuizAnswers;
  kind: 'single' | 'multi';
  label: string;
  options: string[];
}

export interface ComboStep extends QuizStepMeta {
  kind: 'combo';
  subQuestions: ComboSubQuestion[];
}

export type QuizStepConfig = SingleSelectStep | MultiSelectStep | MultiGroupedStep | ComboStep;

export const QUIZ_STEPS: QuizStepConfig[] = [
  {
    id: 'about_you',
    kind: 'combo',
    eyebrow: 'About You',
    question: 'A little about you',
    subtitle: 'Quick basics so we can tailor your feed.',
    subQuestions: [
      {
        field: 'role',
        kind: 'single',
        label: 'I am a…',
        options: ['Resident', 'Business Owner', 'Employee in the area', 'Property Owner', 'Visitor', 'Student'],
      },
      {
        field: 'ageGroup',
        kind: 'single',
        label: 'My age group',
        options: ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
      },
      {
        field: 'household',
        kind: 'multi',
        label: 'My household includes',
        options: ['Children', 'Teenagers', 'Pets', 'Seniors', 'Just adults'],
      },
    ],
  },
  {
    id: 'interests',
    field: 'interests',
    kind: 'multi-grouped',
    eyebrow: "What's your thing?",
    question: 'What are you interested in?',
    subtitle: 'Pick as many as you like across any category.',
    groups: [
      { groupLabel: 'Food & Drink', options: ['Coffee Shops', 'Restaurants', 'Bakeries', 'Bars', 'Wine', 'Craft Beer', 'Food Specials'] },
      { groupLabel: 'Shopping', options: ['Fashion', 'Home Décor', 'Gifts', 'Books', 'Art', 'Local Markets'] },
      { groupLabel: 'Health & Wellness', options: ['Gyms', 'Yoga', 'Running', 'Cycling', 'Hiking', 'Wellness', 'Medical Services'] },
      { groupLabel: 'Family', options: ['Family Activities', 'Schools', 'Kids Events', 'Play Areas', 'Holiday Activities'] },
      { groupLabel: 'Community', options: ['Local News', 'Safety Alerts', 'Community Meetings', 'Volunteer Opportunities', 'Charity Events', 'Local History'] },
      { groupLabel: 'Lifestyle', options: ['Gardening', 'DIY', 'Pets', 'Photography', 'Music', 'Theatre', 'Live Entertainment'] },
      { groupLabel: 'Business', options: ['Networking', 'Local Deals', 'Business News', 'Job Opportunities', 'Property', 'Investments'] },
    ],
  },
  {
    id: 'hear_about',
    field: 'hearAbout',
    kind: 'multi',
    eyebrow: 'Stay in the loop',
    question: 'What would you like to hear about?',
    options: [
      'Weekend Events', 'New Businesses', 'Restaurant Openings', 'Specials & Discounts', 'Community News',
      'Road Closures', 'Water & Power Outages', 'Security Alerts', 'Lost & Found', 'Local Recommendations',
      'Competitions', 'Markets & Festivals',
    ],
  },
  {
    id: 'community',
    kind: 'combo',
    eyebrow: 'Community',
    question: 'Your community',
    subtitle: 'Organisations you care about, and how you’d like to get involved.',
    subQuestions: [
      {
        field: 'organisations',
        kind: 'multi',
        label: 'Which local organisations are important to you?',
        options: ['Schools', 'Churches', 'Sports Clubs', 'Residents Association', 'Security Company', 'CPF', 'Animal Welfare', 'Community Projects'],
      },
      {
        field: 'participation',
        kind: 'multi',
        label: "I'd like to:",
        options: [
          'Review Businesses', 'Recommend Places', 'Submit Events', 'Report Issues', 'Sell Items',
          'Promote My Business', 'Volunteer', 'Join Community Projects',
        ],
      },
    ],
  },
  {
    id: 'weekend_activities',
    field: 'weekendActivities',
    kind: 'multi',
    eyebrow: 'Favourite Activities',
    question: 'How do you usually spend your weekends?',
    options: [
      'Eating Out', 'Coffee', 'Walking', 'Parks', 'Shopping', 'Visiting Friends', 'Family Time',
      'Fitness', 'Live Music', 'Markets', 'Working from Cafés', 'Staying Home',
    ],
  },
  {
    id: 'personalise_feed',
    field: 'feedPreferences',
    kind: 'multi',
    eyebrow: 'Personalise your feed',
    question: 'Show me more of:',
    options: [
      'Hidden Gems', 'New Places', 'Recommended Businesses', 'Community Stories', 'Local Heroes',
      'Events', 'Property', 'Local Services', 'Food', 'Family Activities',
    ],
  },
  {
    id: 'notifications',
    field: 'notificationPreferences',
    kind: 'multi',
    eyebrow: 'Notifications',
    question: 'Notify me about:',
    options: [
      'Emergency Alerts', 'Security Incidents', 'Events Nearby', 'Business Specials', 'Weekend Suggestions',
      'Community News', 'Road Closures', 'Weather Warnings',
    ],
  },
  {
    id: 'join_reason',
    field: 'joinReason',
    kind: 'single',
    eyebrow: 'Last one',
    question: "What best describes why you're joining Hello Hyperlocal?",
    options: [
      'Discover great local businesses', 'Stay informed', 'Meet my community', 'Support local',
      'Find trusted services', 'Keep my family informed', 'Promote my business',
      'Save money with local offers', 'Explore my neighbourhood',
    ],
  },
];
