export function generateAvatar(existing: string[] = [], forBot = false): string {
  if (forBot) {
    return '🤖';
  }
  const rangeStart = 0x1F400;
  const rangeEnd = 0x1F43C;

  let unique = false;
  let avatar = '';
  while (!unique) {
    const randomCharCode = Math.random() * Math.abs(rangeStart - rangeEnd);
    avatar = String.fromCharCode(randomCharCode);
    unique = !existing.includes(avatar);
  }
  return avatar;
}