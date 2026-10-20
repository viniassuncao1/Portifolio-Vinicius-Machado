import { PREVIEWS } from './previews';

describe('previews dos projetos', () => {
  it('tem preview só nos projetos 5 e 6', () => {
    expect(Object.keys(PREVIEWS)).toEqual(['projeto-5', 'projeto-6']);
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
