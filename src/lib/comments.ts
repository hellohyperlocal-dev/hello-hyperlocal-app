import AsyncStorage from '@react-native-async-storage/async-storage';
import { Comment } from './mock-data';

export async function getComments(): Promise<Comment[]> {
  const raw = await AsyncStorage.getItem('hhl_comments');
  return raw ? JSON.parse(raw) : [];
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const comments = await getComments();
  return comments.filter((c) => c.postId === postId);
}

export async function addComment(comment: Comment): Promise<Comment[]> {
  const comments = await getComments();
  const updated = [comment, ...comments];
  await AsyncStorage.setItem('hhl_comments', JSON.stringify(updated));
  return updated;
}
