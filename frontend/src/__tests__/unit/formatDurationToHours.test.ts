import { formatDurationToHours } from '../../utils/duration';

describe('formatDurationToHours', () => {
  it('should convert minutes to hours', () => {
    expect(formatDurationToHours(120)).toBe('2 heures');
    expect(formatDurationToHours(90)).toBe('1.5 heure');
    expect(formatDurationToHours(30)).toBe('0.5 heure');
  });

  it('should handle edge cases', () => {
    expect(formatDurationToHours(null!)).toBe('Non disponible');
  });
});
