/* eslint-disable import/no-anonymous-default-export */
export default {
  list: {
    title: '审核列表',
    pageDesc: '审核列表展示您创建的SQL审核记录',
    createButtonText: '创建审核',
    auditing: '审核中',
    successfully: '审核成功',
    table: {
      title: '所有与我相关的审核',
      filterForm: {
        instanceName: '数据源',
        auditStatus: '审核状态',
        businessTag: '业务标签',
        auditTime: '审核时间',
      },
      updateTagsSuccess: '更新业务标签成功',
      columns: {
        auditID: '审核ID',
        auditStatus: '审核状态',
        businessTag: '业务标签',
        auditRating: '审核评分',
        auditPassRate: '审核通过率（%）',
        createUser: '创建人',
        auditTime: '审核时间',
        instanceName: '数据源',
      },
    },
  },
  create: {
    title: 'SQL审核',
    pageDesc: '您可以在这里获得快速审核SQL',
    createTagErrorTips: '当前标签已存在',
    baseInfo: {
      title: '基本信息',
      businessTag: '业务标签',
      addTag: '新增业务标签',
      addExtraTagPlaceholder: '请输入需要新增的业务标签',
      notTags: '暂无标签数据',
    },

    SQLInfo: {
      title: 'SQL语句',
      auditType: '审核方式',
      dbType: '数据库类型',
      instanceName: '数据源',
      instanceSchema: '数据库',
      staticAudit: '静态审核',
      dynamicAudit: '动态审核',
      uploadType: '选择SQL语句上传方式',
      uploadTypeEnum: {
        sql: '输入SQL语句',
        sqlFile: '上传SQL文件',
        xmlFile: '上传Mybatis的XML文件',
        zipFile: '上传ZIP文件',
        gitRepository: '配置git仓库',
      },
      uploadLabelEnum: {
        sql: 'SQL语句',
        sqlFile: 'SQL文件',
        xmlFile: 'Mybatis的XML文件',
        zipFile: 'ZIP文件',
      },
      auditButton: '审核',
      formatterSQL: 'SQL美化',
      successTips: '创建审核成功',
    },

    result: {
      table: {
        number: '序号',
        auditLevel: '规则等级',
        auditStatus: '审核状态',
        auditResult: '审核结果',
        auditSql: '审核语句',
        describe: '说明',
        analyze: '分析',
      },
    },
  },
  detail: {
    title: 'SQL审核',
    pageDesc: '您可以在这里查看审核结果',
    auditID: '审核ID',
    auditRating: '审核评分',
    auditPassRate: '审核通过率',
  },
};
