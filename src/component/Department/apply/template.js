/**
 * 高值模板树
 */
import React, { PropTypes } from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;
const HighApplyTempTree = ({onSelect, data}) => (
  <Tree
    showLine
    onSelect={onSelect}
  >
    {
      data.map((item, i) => (
        <TreeNode title={item.title} key={item.id} />
      ))
    }
  </Tree>
)

HighApplyTempTree.propTypes = {
  onSelect: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
}

export default HighApplyTempTree;