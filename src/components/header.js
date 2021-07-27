import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import GovtOfHPLogo from './../assets/govt_of_hp_logo.png'
import SamarthLogo from './../assets/samarth_logo.png'
import SSALogo from './../assets/ssa_logo.png'


const styles = {
    header: {
      padding: 12,
    },
    typography: {
        textAlign: "center"
    }
};

class Header extends React.Component {

    render(){
        const { classes } = this.props;
        return (
            <Grid style={styles.header}>
                <Typography style={styles.typography}>
                    {"Please select the filters to see the Dashboard"}
                </Typography>
            </Grid>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Header);
