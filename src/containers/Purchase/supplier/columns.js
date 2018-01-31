export default (e, actions) => {
  return [{
    title: '操作',
    dataIndex: 'actions',
    width: 130,
    fixed: 'left',
    render: actions
  }, {
    title: '编号',
    dataIndex: 'supplierCode',
  }, {
    title: '供应商名称',
    dataIndex: 'orgName',
  }, {
    title: '省市区',
    dataIndex: 'area'
  },{
    title: '联系人',
    dataIndex: 'lxr',
  }, {
    title: '联系电话',
    dataIndex: 'lxdh',
  }];
}