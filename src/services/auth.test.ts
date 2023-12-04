import { Auth } from './auth.js';
import { compare, hash } from 'bcrypt';

jest.mock('bcrypt');

describe('Given Auth abstract class', () => {
  describe('When se use its methods', () => {
    test('Then hash should ...', () => {
      (hash as jest.Mock).mockReturnValue('test');
      const mockValue = '';
      //
      const result = Auth.hash(mockValue);

      expect(hash).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then compare should ...', () => {
      (compare as jest.Mock).mockReturnValue(true);
      const mockValue = '';
      const result = Auth.compare(mockValue, mockValue);
      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
