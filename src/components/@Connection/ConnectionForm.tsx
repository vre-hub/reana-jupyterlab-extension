import React from 'react';
import { TextField } from '../TextField';
//import { createUseStyles } from 'react-jss';

// const useStyles = createUseStyles({
// });

// A form with two TextFields, one for the server name and other for the access Token.

export const ConnectionForm: React.FC = (action) => {
    //const classes = useStyles();

    // We should do a ping request in action to check if the credentials are correct.
    return (
        <div>
            <h2>Enter your credentials</h2>
            <form action=''>
            <TextField id="servername" placeholder="Server name" />
            <TextField id="accesstoken" placeholder="Access Token" type="password" />
            <input type="submit" value="Submit" />
            </form>
        </div>
    );
};