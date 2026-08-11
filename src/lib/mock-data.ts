export interface HeroAnnouncement {
  id: string;
  type: 'hero';
  eyebrow: string;
  title: string;
  description: string;
  ctaText: string;
  imageUrl?: any;
  date: string;
}

export interface LoveLocalOffer {
  id: string;
  type: 'offer';
  businessId?: string;
  businessName: string;
  category: string;
  title: string;
  discount: string;
  originalPrice?: string;
  offerPrice?: string;
  address: string;
  imageUrl: any;
  expiresIn: string;
}

export interface WhatsOnEvent {
  id: string;
  type: 'event';
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  imageUrl: any;
  isUserRsvped?: boolean;
}

export interface CommunityPost {
  id: string;
  type: 'community';
  authorName: string;
  authorInitials: string;
  authorRole: 'Resident' | 'Councillor' | 'Business';
  title: string;
  content: string;
  timeAgo: string;
  upvotes: number;
  commentsCount: number;
  imageUrl?: any;
  isPreApproved?: boolean;
  isUpvoted?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorInitials: string;
  content: string;
  timeAgo: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: 'Restaurants' | 'Coffee Shops' | 'Retail' | 'Guesthouses' | 'Markets' | 'Experiences';
  description: string;
  address: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  hours: string;
  imageUrl: any;
  coordinate: { latitude: number; longitude: number };
}

export interface StoredUserData {
  identifier: string;
  fullName?: string;
  phoneNumber?: string;
  streetAddress?: string;
  businessName?: string;
  avatarUri?: string;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'deal' | 'event' | 'reply';
  title: string;
  body: string;
  timeAgo: string;
  isRead: boolean;
}

export type FeedItem = HeroAnnouncement | LoveLocalOffer | WhatsOnEvent | CommunityPost;

export const LINDEN_MOCK_FEED: FeedItem[] = [
  // 1 Hero Announcement
  {
    id: 'hero-1',
    type: 'hero',
    eyebrow: 'Around the neighbourhood',
    title: 'Load-shedding schedule update',
    description: 'Stage 2 tonight from 8pm–10:30pm. Linden falls under block 4.',
    ctaText: 'Read more →',
    imageUrl: require('../../assets/photography/linden-streetview.jpeg'),
    date: 'Thursday, 18:30',
  },

  // 3 Love Local Offers
  {
    id: 'offer-1',
    type: 'offer',
    businessId: 'biz-1',
    businessName: 'Goddess Café Linden',
    category: 'Café & Bakery',
    title: '2-for-1 Winter Latte & Fresh Croissant Combo',
    discount: 'BUY 1 GET 1 FREE',
    originalPrice: 'R 90',
    offerPrice: 'R 45',
    address: '44 1st Ave, Linden',
    imageUrl: require('../../assets/photography/goddess-cafe-linden.jpg'),
    expiresIn: 'Ends Saturday',
  },
  {
    id: 'offer-2',
    type: 'offer',
    businessId: 'biz-2',
    businessName: 'The Whippet Coffee',
    category: 'Artisan Kitchen',
    title: 'Neighbourhood Breakfast Plate & Flat White',
    discount: '25% OFF',
    originalPrice: 'R 120',
    offerPrice: 'R 90',
    address: '34 7th St, Linden',
    imageUrl: require('../../assets/photography/whippet-linden.jpg'),
    expiresIn: 'Valid Weekdays',
  },
  {
    id: 'offer-3',
    type: 'offer',
    businessId: 'biz-3',
    businessName: 'Churros & Cocoa Linden',
    category: 'Desserts & Sweets',
    title: 'Artisan Churros Box with Belgian Chocolate Dip',
    discount: 'R 30 SPECIAL',
    originalPrice: 'R 65',
    offerPrice: 'R 35',
    address: '4th Avenue Strip, Linden',
    imageUrl: require('../../assets/photography/churros.jpg'),
    expiresIn: 'This Weekend Only',
  },

  // 2 What's On Events
  {
    id: 'event-1',
    type: 'event',
    title: 'Linden Market Weekend Special Edition',
    category: 'Weekend Market',
    description: 'A bigger-than-usual Saturday market at 4th Avenue — extra stalls, live music, and produce straight from local growers. Bring cash for the smaller vendors.',
    date: 'Saturday, 3 August',
    time: '09:00 - 16:00',
    location: '4th Avenue Market Grounds, Linden',
    rsvpCount: 248,
    imageUrl: require('../../assets/photography/linden-market.jpg'),
  },
  {
    id: 'event-2',
    type: 'event',
    title: 'Linden Street Kids Fun Day & Fundraiser',
    category: 'Family & Kids',
    description: 'Face painting, a jumping castle, and a sausage sizzle at 5th Street Park — all proceeds go toward new playground equipment for the neighbourhood.',
    date: 'Sunday, 4 August',
    time: '10:00 - 14:00',
    location: '5th Street Park, Linden',
    rsvpCount: 86,
    imageUrl: require('../../assets/photography/kids-fun-in-street.jpg'),
  },
  {
    id: 'event-3',
    type: 'event',
    title: 'Family Fun Street Party',
    category: 'Family & Kids',
    description: 'A closed-off street, chalk drawing, a mini obstacle course, and neighbours bringing a dish to share — bring a chair and stay a while.',
    date: 'Sunday, 10 August',
    time: '10:00',
    location: '3rd Avenue, Linden',
    rsvpCount: 34,
    imageUrl: require('../../assets/photography/kids-fun-in-street.jpg'),
  },
  {
    id: 'event-4',
    type: 'event',
    title: 'Winter Menu Launch',
    category: 'Food & Drink',
    description: "Goddess Café's new winter menu launches tonight — spiced hot chocolate, a toasted sandwich board, and first tastings for the first 30 through the door.",
    date: 'Friday, 8 August',
    time: '18:00',
    location: 'Goddess Café, 4th Avenue, Linden',
    rsvpCount: 52,
    imageUrl: require('../../assets/photography/winter-menu.jpg'),
  },
  {
    id: 'event-5',
    type: 'event',
    title: 'Night Market Bites',
    category: 'Food & Drink',
    description: 'An evening food market on 7th Street — a handful of local stalls, string lights, and a rotating lineup of Linden home cooks and small kitchens.',
    date: 'Friday, 8 August',
    time: '17:00 - 21:00',
    location: '7th Street, Linden',
    rsvpCount: 41,
    imageUrl: require('../../assets/photography/linden-market-2.jpg'),
  },

  // 1 Community Post
  {
    id: 'comm-1',
    type: 'community',
    authorName: 'Sarah Mitchell',
    authorInitials: 'SM',
    authorRole: 'Resident',
    title: 'Linden Dog Walking & Coffee Social Group',
    content: 'We are starting a weekly sunset dog walking group meeting at 5th Street Park every Tuesday at 17:15, ending with coffee on 4th Ave. All friendly dogs on leashes welcome!',
    timeAgo: '2h ago',
    upvotes: 42,
    commentsCount: 15,
    imageUrl: require('../../assets/photography/dog-walking-park.jpeg'),
    isPreApproved: true,
  },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Load-shedding schedule update',
    body: 'Stage 2 tonight from 8pm–10:30pm. Linden falls under block 4.',
    timeAgo: '30m ago',
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'reply',
    title: 'Sarah Mitchell replied to your comment',
    body: '"Count us in for Tuesday! Our whippet would love the company."',
    timeAgo: '2h ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'deal',
    title: 'New offer from Goddess Café Linden',
    body: '2-for-1 Winter Latte & Fresh Croissant Combo — ends Saturday.',
    timeAgo: '5h ago',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'event',
    title: "RSVP reminder: Linden Market Weekend Special",
    body: "Saturday, 3 August · 09:00–16:00 at 4th Avenue Market Grounds.",
    timeAgo: '1d ago',
    isRead: true,
  },
  {
    id: 'notif-5',
    type: 'reply',
    title: '12 neighbours upvoted your post',
    body: '"Linden Dog Walking & Coffee Social Group" is picking up steam.',
    timeAgo: '2d ago',
    isRead: true,
  },
];

export const LOCAL_BUSINESSES: LocalBusiness[] = [
  {
    id: 'biz-1',
    name: 'Goddess Café Linden',
    category: 'Coffee Shops',
    description: 'A corner café on 4th Avenue pouring flat whites and plating big weekend breakfasts.',
    address: '44 1st Ave, Linden',
    rating: 4.8,
    reviewCount: 128,
    isOpen: true,
    hours: '7am–5pm daily',
    imageUrl: require('../../assets/photography/goddess-cafe-linden.jpg'),
    coordinate: { latitude: -26.1417, longitude: 27.9971 },
  },
  {
    id: 'biz-2',
    name: 'The Whippet Coffee',
    category: 'Restaurants',
    description: 'Neighbourhood pub and kitchen serving hearty breakfast plates and slow Saturday mornings.',
    address: '34 7th St, Linden',
    rating: 4.6,
    reviewCount: 94,
    isOpen: true,
    hours: '8am–9pm daily',
    imageUrl: require('../../assets/photography/whippet-linden.jpg'),
    coordinate: { latitude: -26.1449, longitude: 27.9995 },
  },
  {
    id: 'biz-3',
    name: 'Churros & Cocoa Linden',
    category: 'Restaurants',
    description: 'Artisan churros and hot chocolate on the 4th Avenue strip — a weekend queue favourite.',
    address: '4th Avenue Strip, Linden',
    rating: 4.7,
    reviewCount: 61,
    isOpen: true,
    hours: '10am–8pm, Thu–Sun',
    imageUrl: require('../../assets/photography/churros.jpg'),
    coordinate: { latitude: -26.1428, longitude: 27.9982 },
  },
  {
    id: 'biz-4',
    name: 'Linden Books & Gifts',
    category: 'Retail',
    description: 'An independent bookshop and gift store on the main strip, stocking local authors and cards.',
    address: '18 4th Ave, Linden',
    rating: 4.9,
    reviewCount: 37,
    isOpen: true,
    hours: '9am–5pm, Mon–Sat',
    imageUrl: require('../../assets/photography/linden-streetview.jpeg'),
    coordinate: { latitude: -26.1441, longitude: 27.9978 },
  },
  {
    id: 'biz-5',
    name: 'Linden Village Market',
    category: 'Markets',
    description: 'Weekend market grounds hosting local stalls, live music, and fresh produce on 4th Avenue.',
    address: '4th Avenue Market Grounds, Linden',
    rating: 4.7,
    reviewCount: 210,
    isOpen: false,
    hours: 'Saturdays, 9am–4pm',
    imageUrl: require('../../assets/photography/linden-market.jpg'),
    coordinate: { latitude: -26.1405, longitude: 27.9989 },
  },
  {
    id: 'biz-6',
    name: 'Linden Lanes Guesthouse',
    category: 'Guesthouses',
    description: 'A quiet tree-lined guesthouse for visiting family and weekend stays, walking distance to 4th Avenue.',
    address: '12 Modderfontein Rd, Linden',
    rating: 4.9,
    reviewCount: 47,
    isOpen: true,
    hours: 'Check-in from 2pm',
    imageUrl: require('../../assets/photography/linden-lanes.jpg'),
    coordinate: { latitude: -26.1462, longitude: 28.0004 },
  },
  {
    id: 'biz-7',
    name: 'Linden Dog Walking Co.',
    category: 'Experiences',
    description: 'Sunset dog walks and pet sitting around 5th Street Park, run by neighbours who know every trail.',
    address: '5th Street Park, Linden',
    rating: 5.0,
    reviewCount: 23,
    isOpen: true,
    hours: 'By appointment',
    imageUrl: require('../../assets/photography/dog-walking-park.jpeg'),
    coordinate: { latitude: -26.139, longitude: 27.9995 },
  },
];
