import { convertFileToBase64 } from '../../utils/convertFileToBase64';

describe('convertFileToBase64', () => {
  it('should convert a file to base64', async () => {
    const mockFile = new Blob(['test content'], { type: 'text/plain' });
    const base64String = await convertFileToBase64(mockFile);
    expect(base64String).toContain('data:text/plain;base64');
  });
});
