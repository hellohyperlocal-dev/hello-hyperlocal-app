import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LINDEN_MOCK_FEED, LoveLocalOffer, WhatsOnEvent, CommunityPost, NOTIFICATIONS, StoredUserData } from '../../src/lib/mock-data';
import { Compass, ThumbsUp, MessageSquare, Bell, MoreHorizontal } from 'lucide-react-native';
import { HeroCard } from '../../src/components/HeroCard';
import { PillTabs } from '../../src/components/PillTabs';
import { FacilityCard } from '../../src/components/FacilityCard';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { ReportModal } from '../../src/components/ReportModal';
import { fonts } from '../../src/constants/fonts';
import { colors, layout, radius } from '../../src/constants/theme';
import { getUpvotes, setUpvote } from '../../src/lib/upvotes';

const FEED_TABS = ['Around you', "What's on", 'Love Local'];

export default function MainFeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [activeTab, setActiveTab] = useState(FEED_TABS[0]);
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() =>
    LINDEN_MOCK_FEED.filter((item): item is CommunityPost => item.type === 'community')
  );
  const [blockedAuthors, setBlockedAuthors] = useState<string[]>([]);
  const [heroDismissed, setHeroDismissed] = useState(false);

  const unreadNotifications = NOTIFICATIONS.filter((n) => !n.isRead).length;
  const visiblePosts = communityPosts.filter((post) => !blockedAuthors.includes(post.authorName));

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('hhl_user_role').then(setUserRole);
      AsyncStorage.getItem('hhl_blocked_authors').then((raw) => {
        if (raw) setBlockedAuthors(JSON.parse(raw));
      });
      AsyncStorage.getItem('hhl_user_data').then((raw) => {
        if (raw) setUserData(JSON.parse(raw));
      });
      // Load persisted upvotes and merge with posts
      getUpvotes().then((upvotes) => {
        AsyncStorage.getItem('hhl_user_posts').then((raw) => {
          if (!raw) return;
          const userPosts: CommunityPost[] = JSON.parse(raw);
          const enrichedPosts = userPosts.map((p) => ({
            ...p,
            isUpvoted: upvotes[p.id] ?? false,
          }));
          setCommunityPosts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = enrichedPosts.filter((p) => !existingIds.has(p.id));
            return newOnes.length ? [...newOnes, ...prev] : prev;
          });
        });
      });
    }, [])
  );

  const blockAuthor = async (authorName: string) => {
    const next = [...blockedAuthors, authorName];
    setBlockedAuthors(next);
    await AsyncStorage.setItem('hhl_blocked_authors', JSON.stringify(next));
  };

  const toggleUpvote = async (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, isUpvoted: !post.isUpvoted, upvotes: post.upvotes + (post.isUpvoted ? -1 : 1) }
          : post
      )
    );
    // Persist to AsyncStorage
    const posts = communityPosts.find((p) => p.id === id);
    if (posts) {
      const newState = !posts.isUpvoted;
      await setUpvote(id, newState);
    }
  };

  const heroPost = LINDEN_MOCK_FEED.find((item) => item.type === 'hero');
  const offerPosts = LINDEN_MOCK_FEED.filter((item): item is LoveLocalOffer => item.type === 'offer');
  const eventPosts = LINDEN_MOCK_FEED.filter((item): item is WhatsOnEvent => item.type === 'event');
  const featuredEvent = eventPosts[0];

  const gemsSectionTitle =
    activeTab === "What's on" ? 'Happening this week' : activeTab === 'Love Local' ? 'Love Local picks' : 'Hidden gems near you';
  const gemsSeeAll =
    activeTab === "What's on" ? () => router.push('/whats-on') : activeTab === 'Love Local' ? () => router.push('/love-local') : null;

  const displayName = userData?.businessName || userData?.fullName || 'Linden Member';
  const firstName = displayName.split(' ')[0];
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.topHeader, { paddingTop: insets.top + layout.topBarGap + layout.topBarContentHeight + 16 }]}>
        <View>
          <Text style={styles.greetingText}>Hello, {firstName}.</Text>
          <Text style={styles.suburbCaption}>Linden · Block 4</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel={unreadNotifications > 0 ? `Notifications, ${unreadNotifications} unread` : 'Notifications'}
          >
            <Bell size={20} color={colors.darkSpruce} />
            {unreadNotifications > 0 && <View style={styles.bellBadge} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open your profile"
          >
            <Avatar initials={initials} size={48} variant="solid" imageUri={userData?.avatarUri} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        {/* Community Feed */}
        <Text style={styles.sectionTitle}>Community Feed</Text>

        <TouchableOpacity
          style={styles.composerInput}
          onPress={() => router.push('/share-modal')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Share something with your neighbours"
        >
          <Text style={styles.composerPlaceholder}>Share something with your neighbours…</Text>
        </TouchableOpacity>

        {/* Role-Aware Visitor Banner */}
        {userRole === 'visitor' && (
          <View style={styles.visitorBanner}>
            <View style={styles.visitorBannerHeader}>
              <Compass size={16} color={colors.radioactiveGrass} />
              <Text style={styles.visitorBannerTitle}>VISITOR MODE ACTIVE</Text>
            </View>
            <Text style={styles.visitorBannerBody}>
              You are viewing Linden as a guest. Register as a resident to unlock voting, posting, and RSVPs.
            </Text>
            <TouchableOpacity
              style={styles.visitorUpgradeBtn}
              onPress={() => router.push('/auth?mode=signup&role=resident')}
              accessibilityRole="button"
              accessibilityLabel="Join as resident to unlock full access"
            >
              <Text style={styles.visitorUpgradeText}>Join as resident to unlock</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hero Announcement Card */}
        {heroPost && heroPost.type === 'hero' && !heroDismissed && (
          <HeroCard
            eyebrow={heroPost.eyebrow}
            title={heroPost.title}
            body={heroPost.description}
            ctaText={heroPost.ctaText}
            onDismiss={() => setHeroDismissed(true)}
          />
        )}

        {/* Segmented Feed Tabs */}
        <PillTabs tabs={FEED_TABS} active={activeTab} onChange={setActiveTab} />

        {/* Hidden Gems Grid — reacts to the segmented tab above */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{gemsSectionTitle}</Text>
            {gemsSeeAll && (
              <TouchableOpacity
                onPress={gemsSeeAll}
                accessibilityRole="button"
                accessibilityLabel={`See all ${gemsSectionTitle}`}
              >
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            )}
          </View>

          {activeTab === "What's on" ? (
            <>
              {eventPosts[0] && (
                <FacilityCard
                  size="large"
                  image={eventPosts[0].imageUrl}
                  title={eventPosts[0].title}
                  subtitle={`${eventPosts[0].date} · ${eventPosts[0].rsvpCount} going`}
                  tag="This weekend"
                  onPress={() => router.push(`/event/${eventPosts[0].id}`)}
                />
              )}
              <View style={styles.facilityRow}>
                {eventPosts.slice(1, 3).map((event) => (
                  <FacilityCard
                    key={event.id}
                    size="small"
                    image={event.imageUrl}
                    title={event.title}
                    subtitle={`${event.date} · ${event.rsvpCount} going`}
                    onPress={() => router.push(`/event/${event.id}`)}
                  />
                ))}
              </View>
            </>
          ) : activeTab === 'Love Local' ? (
            <>
              {offerPosts[0] && (
                <FacilityCard
                  size="large"
                  image={offerPosts[0].imageUrl}
                  title={offerPosts[0].businessName}
                  subtitle={`${offerPosts[0].offerPrice} · ${offerPosts[0].category}`}
                  tag={offerPosts[0].discount}
                  onPress={offerPosts[0].businessId ? () => router.push(`/business/${offerPosts[0].businessId}`) : undefined}
                />
              )}
              <View style={styles.facilityRow}>
                {offerPosts.slice(1, 3).map((offer) => (
                  <FacilityCard
                    key={offer.id}
                    size="small"
                    image={offer.imageUrl}
                    title={offer.businessName}
                    subtitle={`${offer.offerPrice} · ${offer.category}`}
                    onPress={offer.businessId ? () => router.push(`/business/${offer.businessId}`) : undefined}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              {featuredEvent && (
                <FacilityCard
                  size="large"
                  image={featuredEvent.imageUrl}
                  title={featuredEvent.title}
                  subtitle={`${featuredEvent.date} · ${featuredEvent.rsvpCount} going`}
                  tag="This weekend"
                  onPress={() => router.push(`/event/${featuredEvent.id}`)}
                />
              )}
              <View style={styles.facilityRow}>
                {offerPosts.slice(0, 2).map((offer) => (
                  <FacilityCard
                    key={offer.id}
                    size="small"
                    image={offer.imageUrl}
                    title={offer.businessName}
                    subtitle={`${offer.offerPrice} · ${offer.category}`}
                    onPress={offer.businessId ? () => router.push(`/business/${offer.businessId}`) : undefined}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Resident Community Posts */}
        {visiblePosts.map((post) => (
          <View key={post.id} style={styles.card3xl}>
            <View style={styles.cardBody}>
              <View style={styles.authorRow}>
                <Avatar initials={post.authorInitials} />
                <View style={styles.authorTextGroup}>
                  <Text style={styles.authorName}>{post.authorName}</Text>
                  <Text style={styles.postTime}>{post.timeAgo}</Text>
                </View>
                {!post.isPreApproved && <Badge label="Pending review" variant="warning" />}
              </View>

              <Text style={styles.itemTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>

              {post.imageUrl && (
                <Image source={post.imageUrl} style={styles.postImage} resizeMode="cover" />
              )}

              <View style={styles.cardFooter}>
                <View style={styles.socialGroup}>
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => toggleUpvote(post.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityState={{ selected: post.isUpvoted }}
                    accessibilityLabel={`${post.isUpvoted ? 'Remove upvote' : 'Upvote'}, ${post.upvotes} upvotes`}
                  >
                    <ThumbsUp
                      size={14}
                      color={post.isUpvoted ? colors.darkSpruce : colors.muted}
                      fill={post.isUpvoted ? colors.darkSpruce : 'none'}
                    />
                    <Text style={[styles.socialText, post.isUpvoted && styles.socialTextActive]}>
                      {post.upvotes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => router.push(`/post/${post.id}`)}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`View comments, ${post.commentsCount} comments`}
                  >
                    <MessageSquare size={14} color={colors.muted} />
                    <Text style={styles.socialText}>{post.commentsCount}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.moreBtn}
                  onPress={() => setReportTarget(post.authorName)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={`More options for ${post.authorName}`}
                >
                  <MoreHorizontal size={16} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <ReportModal
        visible={reportTarget !== null}
        authorName={reportTarget ?? ''}
        onClose={() => setReportTarget(null)}
        onBlockConfirmed={blockAuthor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.warmWhite,
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  greetingText: {
    color: colors.onyx,
    fontSize: 26,
    fontFamily: fonts.sans.extraBold,
  },
  suburbCaption: {
    color: colors.hunterGreen,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: fonts.sans.bold,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.radioactiveGrass,
    borderWidth: 1.5,
    borderColor: colors.warmWhite,
  },
  feedContent: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
  },
  visitorBanner: {
    backgroundColor: colors.darkSpruce,
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  visitorBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  visitorBannerTitle: {
    color: colors.radioactiveGrass,
    fontFamily: fonts.sans.extraBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  visitorBannerBody: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.sans.regular,
  },
  visitorUpgradeBtn: {
    backgroundColor: colors.radioactiveGrass,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  visitorUpgradeText: {
    color: colors.darkSpruce,
    fontFamily: fonts.sans.extraBold,
    fontSize: 12,
  },
  composerInput: {
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  composerPlaceholder: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 14,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.bold,
    fontSize: 15,
  },
  sectionLink: {
    color: colors.hunterGreen,
    fontFamily: fonts.sans.bold,
    fontSize: 12,
  },
  facilityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card3xl: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  cardBody: {
    padding: 16,
    gap: 8,
  },
  itemTitle: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 15,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  socialGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moreBtn: {
    padding: 4,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorTextGroup: {
    flex: 1,
  },
  authorName: {
    color: colors.onyx,
    fontFamily: fonts.sans.extraBold,
    fontSize: 13,
  },
  postTime: {
    color: colors.muted,
    fontFamily: fonts.sans.regular,
    fontSize: 11,
  },
  postContent: {
    color: colors.onyx,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.sans.regular,
  },
  postImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginVertical: 4,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  socialText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fonts.mono.regular,
  },
  socialTextActive: {
    color: colors.darkSpruce,
    fontFamily: fonts.mono.medium,
  },
});
