import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import GovtOfHPLogo from './../assets/govt_of_hp_logo.png'
import SamarthLogo from './../assets/samarth_logo.png'
import SSALogo from './../assets/ssa_logo.png'


const styles = theme => ({
    footer: {
      backgroundColor: theme.palette.background.paper,
    },
});

class Footer extends React.Component {

    getBranding(containerClass){
        return (
            <Grid container spacing={40} justify="center" alignContent="center" alignItems="center" className={containerClass} xs={12}>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image" src={GovtOfHPLogo} alt="govtOfHPLogo"/>
                </Grid>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image" src={SamarthLogo} alt="samarthLogo"/>
                </Grid>
                <Grid className="branding-div" item xs={4} justify="center" alignContent="center" alignItems="center">
                    <img className="branding-image2" src={SSALogo} alt="SSALogo"/>
                </Grid>
            </Grid>
        );
    }

    render(){
        const { classes } = this.props;
        return (
            <footer className={classes.footer}>
                {this.getBranding()}
            </footer>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Footer);
  