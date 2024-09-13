import { Test, TestingModule } from '@nestjs/testing';
import { ManageMentorController } from '../manage-mentor.controller';

describe('ManageMentorController', () => {
  let controller: ManageMentorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageMentorController],
    }).compile();

    controller = module.get<ManageMentorController>(ManageMentorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
