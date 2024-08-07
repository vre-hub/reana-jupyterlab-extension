import React from 'react';
import { TextField } from '../TextField';
import { createUseStyles } from 'react-jss';

import { IReanaAuthCredentials } from '../../types';
import { Button } from '../Button';
import { UIStore } from '../../stores/UIStore';
import { requestAPI } from '../../utils/ApiRequest';

import { Notification } from '@jupyterlab/apputils';

const useStyles = createUseStyles({
  container: {
    padding: '8px 16px 8px 16px'
  },
  label: {
    margin: '4px 0 4px 0'
  },
  textFieldContainer: {
    margin: '8px 0 8px 0'
  },
  buttonsContainer: {
    extend: 'textFieldContainer',
    display: 'flex',
    justifyContent: 'flex-end'
  },
});

interface IConnectionProps {
  params?: IReanaAuthCredentials;
  onAuthParamsChange: { (val: IReanaAuthCredentials): void };
  actionAfterSubmit?: { (): void };
}

type MyProps = IConnectionProps & React.HTMLAttributes<HTMLDivElement>;

async function checkConnection(server: string, accessToken: string, actionAfterSubmit?: { (): void }) {
  try {
    const data = await requestAPI<any>('env', {
      method: 'POST',
      body: JSON.stringify({ server, accessToken }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    Notification.emit(
      data.message,
      data.status,
      {
        autoClose: 3000,
      }
    );

    // Update UI store
    UIStore.update(s => {
      s.authConfig = {
        server: server,
        accessToken: accessToken
      };
      s.hasConnection = data.status === 'success';
    });

  } catch (error) {
    Notification.error(
      'Connection Error',
      {
        autoClose: 3000,
      }
    )
  } finally {
    if (actionAfterSubmit) {
      actionAfterSubmit();
    }
  }

}
export const ConnectionForm: React.FC<MyProps> = ({
  params = { server: '', accessToken: '' },
  onAuthParamsChange,
  actionAfterSubmit = () => { }
}) => {
  const classes = useStyles();

  const onServerChange = (server: string) => {
    onAuthParamsChange({ ...params, server });
  };

  const onAccessTokenChange = (accessToken: string) => {
    onAuthParamsChange({ ...params, accessToken });
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.textFieldContainer}>
          <div className={classes.label}>Server Name</div>
          <TextField
            placeholder="Server Name"
            value={params.server}
            onChange={e => onServerChange(e.target.value)}
          />
        </div>
        <div className={classes.textFieldContainer}>
          <div className={classes.label}>Access Token</div>
          <TextField
            placeholder="Access Token"
            type="password"
            value={params.accessToken}
            onChange={e => onAccessTokenChange(e.target.value)}
          />
        </div>
        <div className={classes.buttonsContainer}>
          <Button onClick={() => checkConnection(params.server, params.accessToken, actionAfterSubmit)}>Connect</Button>
        </div>
      </div>
    </>
  );
};