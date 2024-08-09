import { Test, TestingModule } from '@nestjs/testing';
import { ManageMentorService } from './manage-mentor.service';

describe('ManageMentorService', () => {
  let service: ManageMentorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManageMentorService],
    }).compile();

    service = module.get<ManageMentorService>(ManageMentorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
