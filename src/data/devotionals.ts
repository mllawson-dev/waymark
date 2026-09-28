import type { Devotional } from '../types/devotional';

export const devotionals: Devotional[] = [
  {
    id: 'dev-001',
    date: '2026-08-18',
    title: 'Steady on the path',
    verseReference: 'Psalm 119:105',
    verseText: 'Your word is a lamp to my feet and a light to my path.',
    reflection:
      'We rarely see the whole road ahead. Most days we get just enough light for the next step, and that is by design, not by accident.',
    prayer:
      'Lord, thank You for lighting the step in front of me even when I cannot see the whole path. Help me trust You with what is still dark.',
  },
  {
    id: 'dev-002',
    date: '2026-08-17',
    title: 'Carried, not just guided',
    verseReference: 'Isaiah 46:4',
    verseText: 'Even to your old age I am he, and to gray hairs I will carry you.',
    reflection:
      'A guide points the way and lets you walk it alone. This verse promises something more — to be carried, not just shown the direction.',
    prayer: 'Father, on the days I cannot take another step on my own, thank You for carrying me.',
  },
  {
    id: 'dev-003',
    date: '2026-08-16',
    title: 'One step is enough',
    verseReference: 'Matthew 6:34',
    verseText: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself.',
    reflection:
      'Anxiety tries to make us carry every future day today. Grace only asks for today.',
    prayer: 'Lord, keep my hands open to today and closed to the weight of tomorrow.',
  },
];

export function getDailyDevotional(date = new Date()): Devotional {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86_400_000);
  return devotionals[(dayOfYear - 1 + devotionals.length) % devotionals.length] ?? devotionals[0]!;
}
