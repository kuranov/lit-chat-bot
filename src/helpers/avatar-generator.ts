export function avatarGenerator(existing: string[] = [], forBot = false): string {
  if (forBot) {
    return '🤖';
  }
  const rangeStart = 0x1f400;
  const rangeEnd = 0x1f43c;

  let unique = false;
  let avatar = '';
  while (!unique) {
    const randomCharCode =
      rangeStart + Math.floor(Math.random() * Math.abs(rangeEnd - rangeStart));
    avatar = String.fromCodePoint(randomCharCode);
    unique = !existing.includes(avatar);
  }
  return avatar;
}