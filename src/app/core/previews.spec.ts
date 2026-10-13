import { PREVIEWS } from './previews';

describe('previews dos projetos', () => {
  it('tem preview só nos projetos 2 e 3', () => {
    expect(Object.keys(PREVIEWS)).toEqual(['projeto-2', 'projeto-3']);
  });

  it.each(Object.entries(PREVIEWS))(
    '%s tem site https, captura local e texto alternativo',
    (_, preview) => {
      expect(preview.url).toMatch(/^https:\/\//);
      expect(preview.captura.src).toMatch(/^projetos\/.+\.jpg$/);
      expect(preview.captura.largura).toBeGreaterThan(0);
      expect(preview.captura.altura).toBeGreaterThan(0);
      expect(preview.captura.alt.length).toBeGreaterThan(20);
    },
  );
});
