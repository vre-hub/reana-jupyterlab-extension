import React from 'react';
import { requestAPI } from './ApiRequest';



export class Actions {
    async envVariables(server: string, accessToken: string) {
        try {
            await requestAPI<any>('env_variables', {
                method: 'POST',
                body: JSON.stringify({ server, accessToken }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Variables set successfully');
        } catch (error) {
            console.error('Error setting variables:', error);
        }
    }
}


export const actions = new Actions();

export interface IWithRequestAPIProps {
    actions: Actions;
}

//eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function withRequestAPI<P>(Component: React.ComponentType<P>) {
    return class WithRequestAPI extends React.Component<P> {
        //eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        render() {
            const { ...props } = this.props;
            return <Component { ...(props as P) } actions = { actions } />;
        }
    };
}