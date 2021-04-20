export enum ResponseCode {
  SUCCESS = 0,
}

export enum SystemRole {
  admin = 'admin',
}

export enum ModalSize {
  big = 1000,
}

export const ModalFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13 },
  },
};

export const PageFormLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

export const FilterFormLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

export const FilterFormColLayout = {
  xs: 24,
  sm: 12,
  xl: 8,
  xxl: 6,
};

export const filterFormButtonLayoutFactory = (
  smOffset = 0,
  xlOffset = 0,
  xxlOffset = 0
) => ({
  xs: 24,
  sm: {
    span: 12,
    offset: smOffset,
  },
  xl: {
    span: 8,
    offset: xlOffset,
  },
  xxl: {
    span: 6,
    offset: xxlOffset,
  },
});

export const FilterFormRowLayout = {
  gutter: 24,
};