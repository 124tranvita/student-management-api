import { Test, TestingModule } from '@nestjs/testing';
import { MentorShareService } from './share.service';

describe('MentorShareService', () => {
  let service: MentorShareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorShareService],
    }).compile();

    service = module.get<MentorShareService>(MentorShareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
