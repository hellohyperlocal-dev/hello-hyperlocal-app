import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUpvotes(): Promise<Record<string, boolean>> {
  const raw = await AsyncStorage.getItem('hhl_upvotes');
  return raw ? JSON.parse(raw) : {};
}

export async function setUpvote(postId: string, upvoted: boolean): Promise<Record<string, boolean>> {
  const current = await getUpvotes();
  const next = { ...current, [postId]: upvoted };
  await AsyncStorage.setItem('hhl_upvotes', JSON.stringify(next));
  return next;
}

export async function isPostUpvoted(postId: string): Promise<boolean> {
  const upvotes = await getUpvotes();
  return upvotes[postId] ?? false;
}
