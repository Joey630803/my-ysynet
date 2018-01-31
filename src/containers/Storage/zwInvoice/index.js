/**
 * 总务发票
 */
import React from 'react';
class ZwInvoice extends React.Component{
    render(){
        return (
            <div>
                {
                    this.props.children ||
                    <div>
                        总务发票
                    </div>
                }
            </div>
        )
    }
}
module.exports = ZwInvoice;