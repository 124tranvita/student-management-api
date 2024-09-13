import { Test, TestingModule } from '@nestjs/testing';
import { ManageClassroomService } from '../manage-classroom.service';

describe('ManageClassroomService', () => {
  let service: ManageClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManageClassroomService],
    }).compile();

    service = module.get<ManageClassroomService>(ManageClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
