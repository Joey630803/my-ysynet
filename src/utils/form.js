import React from 'react';

export const emailAutoCompeleteCheck = (value) => {
    let emailOptions;
    if (!value || value.indexOf('@') >= 0) {
      emailOptions = [];
    } else {
      emailOptions = ['gmail.com', '163.com', 'qq.com'].map((domain) => {
        const email = `${value}@${domain}`;
        return <Option key={email}>{email}</Option>;
      });
    }
    return emailOptions;
}