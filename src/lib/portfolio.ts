import 'server-only';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import type { TeamMember } from '@/data/team';
import { portfolioDescriptions } from '@/data/portfolio-descriptions';

export type PortfolioItem = { src: string; kind: 'photo' | 'video'; caption: string; description?: string; category: string };

// Add media to public/gallery/<first-name>-gallery and rebuild to publish it.
export async function getPortfolioItems(member: TeamMember): Promise<PortfolioItem[]> {
  let entries;
  try {
    entries = await readdir(path.join(process.cwd(), 'public', 'gallery', member.galleryFolder), { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return entries.filter(entry => entry.isFile() && /\.(jpe?g|png|webp|mp4|webm|mov)$/i.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }))
    .map(({ name }) => {
      const caption = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
      return {
        src: `/gallery/${member.galleryFolder}/${encodeURIComponent(name)}`,
        kind: /\.(mp4|webm|mov)$/i.test(name) ? 'video' : 'photo',
        caption,
        description: portfolioDescriptions[member.slug]?.[name] ?? portfolioDescriptions[member.slug]?.[caption],
        category: member.service === 'Nail Technician' ? 'Nail artistry' : member.service === 'Hair Stylist' ? 'Hair artistry' : 'Skin & beauty',
      };
    });
}
