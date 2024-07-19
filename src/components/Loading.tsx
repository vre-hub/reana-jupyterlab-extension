import { createUseStyles } from "react-jss";
import React from "react";
import { Spinning } from "./Spinning";

const useStyles = createUseStyles({
    loading: {
        padding: '16px'
      },
      icon: {
        fontSize: '10px',
        verticalAlign: 'middle',
      },
      iconText: {
        verticalAlign: 'middle',
        paddingLeft: '4px'
      }
});

export const Loading: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
    const classes = useStyles();

    return (
        <div className={classes.loading}>
            <Spinning className={`${classes.icon} material-symbols-outlined`}>
              hourglass_top
            </Spinning>
            <span className={classes.iconText}>Loading...</span>
        </div>
      );
}