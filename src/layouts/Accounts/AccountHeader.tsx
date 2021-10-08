import React, { useState } from 'react';
import { AccountEditProps, AccountEdit } from './AccountEdit';
import { AccountView } from './AccountView';

interface AccountHeaderProps extends AccountEditProps {
  onRemove: (id: number) => void;
}

export const AccountHeader = (props: AccountHeaderProps) => {
  const [edit, setEdit] = useState(false);
  const { account, onCancel, onRemove } = props;
  const newAccount = account.id ? false : true;

  const handleCancel = () => {
    if (newAccount) {
      onCancel();
    } else {
      setEdit(false);
    }
  };

  const handleRemove = () => {
    if (account.id) {
      onRemove(account.id);
    }
  };

  if (newAccount || edit) {
    return <AccountEdit {...props} onCancel={handleCancel} />;
  } else {
    return <AccountView account={account} onEdit={() => setEdit(true)} onRemove={handleRemove} />;
  }
};
