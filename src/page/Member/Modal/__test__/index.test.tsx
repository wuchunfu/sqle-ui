import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import MemberModal from '..';
import { ModalName } from '../../../../data/ModalName';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseRole,
} from '../../../../testUtils/mockRequest';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test', () => {
  let dispatchSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;

  beforeEach(() => {
    mockUseRole();
    mockUseInstance();
    dispatchSpy = mockUseDispatch().scopeDispatch;

    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });

    mockUseSelector({
      member: {
        modalStatus: {
          [ModalName.Add_Member]: false,
          [ModalName.Update_Member]: false,
          [ModalName.Add_Member_Group]: false,
          [ModalName.Update_Member_Group]: false,
        },
      },
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });

  test('should dispatch "initMemberModalStatus" when MemberModal is first render', () => {
    expect(dispatchSpy).toBeCalledTimes(0);
    render(<MemberModal />);
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Member]: false,
          [ModalName.Update_Member]: false,
          [ModalName.Add_Member_Group]: false,
          [ModalName.Update_Member_Group]: false,
        },
      },
    });
  });
});
