import { Test, TestingModule } from '@nestjs/testing';
import { ManageClassroomController } from '../manage-classroom.controller';

describe('ManageClassroomController', () => {
  let controller: ManageClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManageClassroomController],
    }).compile();

    controller = module.get<ManageClassroomController>(
      ManageClassroomController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
