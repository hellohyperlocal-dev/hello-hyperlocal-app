import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fonts } from '../../src/constants/fonts';
import { colors, radius } from '../../src/constants/theme';
import { Comment, CommunityPost, StoredUserData } from '../../src/lib/mock-data';
import { getCommentsByPostId, addComment } from '../../src/lib/comments';
import { getUpvotes, setUpvote, isPostUpvoted } from '../../src/lib/upvotes';
import { Avatar } from '../../src/components/Avatar';
import { Badge } from '../../src/components/Badge';
import { Skeleton, SkeletonListRow } from '../../src/components/StateViews';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = React.useState<CommunityPost | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [commentText, setCommentText] = React.useState('');
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [postUpvotes, setPostUpvotes] = React.useState(0);
  const [userData, setUserData] = React.useState<StoredUserData | null>(null);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadPost = async () => {
        try {
          const postsJson = await AsyncStorage.getItem('hhl_user_posts');
          const allPosts: CommunityPost[] = postsJson ? JSON.parse(postsJson) : [];
          const foundPost = allPosts.find((p) => p.id === id);
          setPost(foundPost || null);

          if (foundPost) {
            const comments = await getCommentsByPostId(id);
            setComments(comments);
            setPostUpvotes(foundPost.upvotes);

            const upvoted = await isPostUpvoted(id);
            setIsUpvoted(upvoted);
          }

          const userDataJson = await AsyncStorage.getItem('hhl_user_data');
          if (userDataJson) {
            setUserData(JSON.parse(userDataJson));
          }
        } catch (error) {
          console.error('Error loading post:', error);
        } finally {
          setLoading(false);
        }
      };

      loadPost();
    }, [id])
  );

  const handleUpvote = async () => {
    if (!post) return;

    const newIsUpvoted = !isUpvoted;
    setIsUpvoted(newIsUpvoted);
    setPostUpvotes((prev) => (newIsUpvoted ? prev + 1 : prev - 1));

    await setUpvote(id, newIsUpvoted);
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !post || !userData) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: id,
      authorName: userData.fullName || userData.identifier || 'Anonymous',
      authorInitials: (userData.fullName || userData.identifier || 'A')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
      content: commentText,
      timeAgo: 'Just now',
    };

    const updatedComments = await addComment(newComment);
    setComments(updatedComments);

    // Update comment count on the post
    const postsJson = await AsyncStorage.getItem('hhl_user_posts');
    const allPosts: CommunityPost[] = postsJson ? JSON.parse(postsJson) : [];
    const updatedPosts = allPosts.map((p) =>
      p.id === id ? { ...p, commentsCount: p.commentsCount + 1 } : p
    );
    await AsyncStorage.setItem('hhl_user_posts', JSON.stringify(updatedPosts));

    setCommentText('');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={16} color={colors.darkSpruce} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postCard}>
          <Skeleton width="100%" height={240} radius={0} />
          <View style={styles.postHeader}>
            <SkeletonListRow />
          </View>
          <View style={{ marginHorizontal: 16, gap: 8, marginBottom: 16 }}>
            <Skeleton width="90%" height={15} />
            <Skeleton width="70%" height={15} />
          </View>
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft size={16} color={colors.darkSpruce} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.notFound}>We couldn't find that post.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={16} color={colors.darkSpruce} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* Post Content */}
        <View style={styles.postCard}>
          {/* Hero Image */}
          {post.imageUrl && <Image source={post.imageUrl} style={styles.heroImage} resizeMode="cover" />}

          {/* Author Info */}
          <View style={styles.postHeader}>
            <View style={styles.authorRow}>
              <Avatar initials={post.authorInitials} variant="soft" />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.authorName}</Text>
                <Text style={styles.authorRole}>{post.authorRole}</Text>
              </View>
            </View>
            <Text style={styles.timeAgo}>{post.timeAgo}</Text>
          </View>

          {/* Pending Badge */}
          {post.isPreApproved === false && (
            <Badge label="Pending review" variant="warning" style={styles.pendingBadge} />
          )}

          {/* Post Text */}
          {post.title && <Text style={styles.postTitle}>{post.title}</Text>}
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, isUpvoted && styles.actionBtnActive]}
              onPress={handleUpvote}
              accessibilityRole="button"
              accessibilityState={{ selected: isUpvoted }}
              accessibilityLabel={`${isUpvoted ? 'Remove upvote' : 'Upvote'}, ${postUpvotes} upvotes`}
            >
              <ThumbsUp size={18} color={isUpvoted ? colors.darkSpruce : colors.muted} fill={isUpvoted ? colors.darkSpruce : 'none'} />
              <Text style={[styles.actionText, isUpvoted && styles.actionTextActive]}>{postUpvotes}</Text>
            </TouchableOpacity>

            <View style={styles.actionBtn} accessibilityLabel={`${comments.length} comments`}>
              <MessageSquare size={18} color={colors.muted} />
              <Text style={styles.actionText}>{comments.length}</Text>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsSectionTitle}>Comments ({comments.length})</Text>

          {comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          ) : (
            comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Avatar initials={comment.authorInitials} variant="soft" />
                <View style={styles.commentBody}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                    <Text style={styles.commentTime}>{comment.timeAgo}</Text>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.textInput}
            placeholder="Add a comment..."
            placeholderTextColor={colors.muted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
            accessibilityLabel="Add a comment"
          />
          <TouchableOpacity
            style={[styles.submitBtn, !commentText.trim() && styles.submitBtnDisabled]}
            onPress={handleAddComment}
            disabled={!commentText.trim()}
            accessibilityRole="button"
            accessibilityLabel="Post comment"
            accessibilityState={{ disabled: !commentText.trim() }}
          >
            <Text style={styles.submitText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmWhite,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontFamily: fonts.sans.medium,
    fontSize: 14,
    color: colors.darkSpruce,
  },
  notFound: {
    fontFamily: fonts.sans.regular,
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 32,
  },
  scrollContent: {
    flex: 1,
  },
  postCard: {
    backgroundColor: colors.warmWhite,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  postHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 14,
    color: colors.onyx,
    marginBottom: 2,
  },
  authorRole: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.muted,
  },
  timeAgo: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.muted,
  },
  pendingBadge: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  postTitle: {
    fontFamily: fonts.sans.bold,
    fontSize: 18,
    color: colors.onyx,
    lineHeight: 24,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  postContent: {
    fontFamily: fonts.sans.regular,
    fontSize: 15,
    color: colors.onyx,
    lineHeight: 22,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnActive: {
    opacity: 1,
  },
  actionText: {
    fontFamily: fonts.mono.regular,
    fontSize: 13,
    color: colors.muted,
  },
  actionTextActive: {
    color: colors.darkSpruce,
    fontWeight: '600',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  commentsSectionTitle: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 15,
    color: colors.onyx,
    marginBottom: 16,
  },
  noComments: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  commentBody: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 13,
    color: colors.onyx,
  },
  commentTime: {
    fontFamily: fonts.sans.regular,
    fontSize: 12,
    color: colors.muted,
  },
  commentContent: {
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    color: colors.onyx,
    lineHeight: 20,
  },
  spacer: {
    height: 80,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.warmWhite,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.sans.regular,
    fontSize: 14,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.divider,
    color: colors.onyx,
  },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.darkSpruce,
    borderRadius: radius.pill,
  },
  submitBtnDisabled: {
    backgroundColor: colors.muted,
    opacity: 0.5,
  },
  submitText: {
    fontFamily: fonts.sans.semiBold,
    fontSize: 14,
    color: colors.warmWhite,
  },
});
