import project from '../../../api/project';
import { resolveThreeSecond } from '../../../testUtils/mockRequest';

export const mockGetProjectList = () => {
  const spy = jest.spyOn(project, 'getProjectListV1');
  spy.mockImplementation(() =>
    resolveThreeSecond(
      Array.from({ length: 11 }, (_, i) => ({
        id: i + 1,
        name: 'project1',
        desc: 'desc1',
        create_time: '2022-11-01',
        create_user_name: 'admin',
      })),
      { otherData: { total_nums: 11 } }
    )
  );
  return spy;
};

export const mockDeleteProject = () => {
  const spy = jest.spyOn(project, 'deleteProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockCreateProject = () => {
  const spy = jest.spyOn(project, 'createProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};

export const mockUpdateProject = () => {
  const spy = jest.spyOn(project, 'updateProjectV1');
  spy.mockImplementation(() => resolveThreeSecond({}));
  return spy;
};
