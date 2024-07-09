import React from 'react';
import { TextField } from '../TextField';
import { createUseStyles } from 'react-jss';

import { IReanaAuthCredentials } from '../../types';
import { Button } from '../Button';
import { UIStore } from '../../stores/UIStore';

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
    // warning: {
    //   margin: '8px 8px 16px 8px',
    //   color: 'var(--jp-ui-font-color2)',
    //   fontSize: '9pt'
    // },
  });

interface IConnectionProps {
    params?: IReanaAuthCredentials;
    onAuthParamsChange: { (val: IReanaAuthCredentials): void };
}

type MyProps = IConnectionProps & React.HTMLAttributes<HTMLDivElement>;

function pingServer(server: string, accessToken: string) {
    return Math.random() < 0.8;
}

function checkConnection(server: string, accessToken: string) {
    // Update UI store
    UIStore.update(s => {
        s.authConfig = {
            server: server,
            accessToken: accessToken
        };
    });

    UIStore.update(s => {
        s.hasConnection = pingServer(server, accessToken);
    });

    
}
export const ConnectionForm: React.FC<MyProps> = ({
    params = {server: '', accessToken: ''},
    onAuthParamsChange
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
            <div className={classes.textFieldContainer}>
                <Button onClick={() => checkConnection(params.server, params.accessToken)}>Connect</Button>
            </div>
          </div>
        </>
      );
};