import { Test, type TestingModule } from '@nestjs/testing';

import type { HelloResponse } from '@/generated/models';
import { HelloService } from '@/modules/hello/hello.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelloService],
    }).compile();

    service = module.get<HelloService>(HelloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('helloGetHello', () => {
    it('should return a hello message', () => {
      const mockRequest = {} as Request;
      const result: HelloResponse = service.helloGetHello(mockRequest);

      expect(result).toBeDefined();
      expect(result.message).toBe('Hello from REST API!');
    });

    it('should return HelloResponse with message property', () => {
      const mockRequest = {} as Request;
      const result: HelloResponse = service.helloGetHello(mockRequest);

      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });

    it('should return non-empty message', () => {
      const mockRequest = {} as Request;
      const result: HelloResponse = service.helloGetHello(mockRequest);

      expect(result.message).not.toBe('');
      expect(result.message.length).toBeGreaterThan(0);
    });
  });
});
