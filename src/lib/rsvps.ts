import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getRsvps(): Promise<Record<string, boolean>> {
  const raw = await AsyncStorage.getItem('hhl_rsvps');
  return raw ? JSON.parse(raw) : {};
}

export async function setRsvp(eventId: string, going: boolean): Promise<Record<string, boolean>> {
  const current = await getRsvps();
  const next = { ...current, [eventId]: going };
  await AsyncStorage.setItem('hhl_rsvps', JSON.stringify(next));
  return next;
}
