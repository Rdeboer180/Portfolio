import type { AtlasBuild } from '../../data/talent/atlasState';
import type { AtlasAbilityState } from '../../data/talent/atlas';
import { proficiencyName, resolveMastery } from '../../data/talent/mastery';
const escape = (text: string) => text.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]!));
export async function exportForgeCard(build: AtlasBuild, mastery: ReturnType<typeof resolveMastery>, earned: AtlasAbilityState[], crest: string, url: string) {
  const rows = earned.map((s, i) => `<text x="48" y="${310 + i * 30}" font-size="16">${escape(proficiencyName(s))}</text><text x="590" y="${310 + i * 30}" text-anchor="end" font-size="14">${s.rank}/5</text>`).join('');
  const height = Math.max(450, 390 + earned.length * 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${height}" viewBox="0 0 640 ${height}"><rect width="640" height="${height}" fill="#f8f8f7"/><g fill="#202b30" font-family="Arial,sans-serif"><text x="48" y="50" font-size="14">THE FORGE · ${escape(build.intake.name || 'My build')}</text><g transform="translate(42 68)">${crest.replace('<svg ', '<svg width="110" height="120" ')}</g><text x="180" y="116" font-size="28" font-weight="bold">${escape(mastery.title)}</text><text x="180" y="146" font-size="16">${escape(mastery.primary ? `Mastery of ${mastery.primary.name.toLowerCase()}` : 'A practice taking shape')}</text><text x="48" y="250" font-size="13">EARNED PROFICIENCIES · ${earned.length}</text>${rows}<a href="${escape(url)}"><text x="48" y="${height - 35}" font-size="14" fill="#c23001">Explore this build ↗ · rdeboerdesigns.com</text></a></g></svg>`;
  const blobUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const link = document.createElement('a'); link.href = blobUrl; link.download = 'my-forge-build.svg'; link.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
