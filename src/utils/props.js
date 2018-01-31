import * as Actions from 'actions/index'
import { bindActionCreators } from 'redux'

export const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
})
export const mapStateToProps = state => ({
  actionState: state
})