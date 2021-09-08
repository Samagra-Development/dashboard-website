import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {withRouter} from 'react-router-dom'
import {Typography, Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import GovtOfHaryanaLogo from './../assets/Haryana Govt logo.png'
import {withStyles} from '@material-ui/core/styles';
import GovtOfHPLogo from './../assets/govt_of_hp_logo.png'
import HomeMobileLogo from './../assets/Homepage Img.png'
import SakshamHaryanaLogo from './../assets/Saksham Haryana logo.png'
import scertLogo from './../assets/logo_scert.png'
import gohLogo from './../assets/GoH-Transparent.png'
import avsarLogo from './../assets/_Avsar.png'
import SamarthLogo from './../assets/samarth_logo.png'
import SSALogo from './../assets/ssa_logo.png'
import Footer from '../components/footer';
import {trackPage, trackUser, trackEvent} from 'react-with-analytics';
import {dispatchCustomEvent} from "../utils";
import Toolbar from "@material-ui/core/Toolbar";
import {Redirect} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const logs = [
    {name:'Logo scert',url:scertLogo},
    {name:'GoH-Transparent',url:gohLogo},
    {name:'Avsar',url:avsarLogo},
    {name:'Saksham Haryana logo',url:SakshamHaryanaLogo}
];

const styles = {
    dashboardLink: {
        color: 'white',
    },
    brandingContainer: {
        marginTop: "2%",
    },
    subHeading: {
        position: "absolute",
        bottom: "20%",
        color: 'white',
        fontSize: "1rem"
    }
};

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.thisIsTheEndMyOnlyFriendTheEnd = React.createRef();
        this.state = {width: 0, height: 0,levels:[]};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getLinkElement = this.getLinkElement.bind(this);
        this.getBranding = this.getBranding.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.setLevels = this.setLevels.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'Department of School Education Dashboards'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    getLinkElement(text, route, shouldFloatRight, subHeading) {
        let linkStyle, divStyle;
        if (shouldFloatRight && this.state.width >= 1280) {
            linkStyle = {textDecoration: 'none', float: "right"};
            divStyle = {float: "right", position: "relative"};
        } else {
            linkStyle = {textDecoration: 'none'};
            divStyle = {};
        }
        return (
            <Grid item style={{width: this.state.width / 3}} alignContent="center" alignItems="center" xs={12} sm={6}>
                <Link
                    style={linkStyle}
                    className="App-link Dashboard-Links"
                    to={route}>
                    <Paper className="route-link" elevation={1} square={true} style={divStyle}>
                        <Typography variant="h5" component="h3" className="dashboard-link-title" align="center">
                            {text}
                        </Typography>
                        {subHeading !== "" && this.state.width > 600 &&
                        <Typography variant="h6" component="h6" style={styles.subHeading}>
                            {subHeading}
                        </Typography>
                        }
                    </Paper>
                </Link>
            </Grid>
        );
    }

    scrollToBottom() {
        trackEvent('HomePage', 'View Dashboard', 'Click');
        try {
            this.thisIsTheEndMyOnlyFriendTheEnd.current.scrollIntoView({behavior: "smooth"});
        } catch (e) {
        }
    }


    getBranding(containerClass) {
        return (
            <Grid container spacing={40} justify="center" alignContent="center" alignItems="center"
                  className={containerClass}>
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

    setLevels(e) {
        let levelOptions = [
            {label: 'State',value:'state'},
            {label: 'District',value:'district'},
            {label: 'Block',value:'block'},
        ];
        if(['sat-level','sat-elementary','sat-sr-secondary'].includes(e.target.value)) {
            levelOptions = [...levelOptions,{label: 'School',value:'school'}];
            if(['sat-elementary','sat-sr-secondary'].includes(e.target.value)) {
                levelOptions = levelOptions.filter(e => e.value != 'state');
            }
        } else if(['e-mentoring','sat-state-dashboard'].includes(e.target.value)) {
            levelOptions = [];
        }
        this.setState({selectedDashboard: e.target.value,levels: levelOptions});
    }

    render() {
        const {classes} = this.props;

        const {selectedDashboard, selectedLevel} = this.state;
        let urlPart1, urlPart2;
        switch (selectedDashboard) {
            case 'e-vidyalaya' :
                urlPart1 = '/e-vidyalaya';
                break;
            case 'e-mentoring':
                urlPart1 = '/e-mentoring';
                break;
            case 'sat-elementary' :
                urlPart1 = '/sat-elementary';
                break;
            case 'sat-sr-secondary' :
                urlPart1 = '/sat-sr-secondary';
                break;
            case 'sat-state-dashboard' :
                urlPart1 = '/sat-state-dashboard';
                break;
            case 'sat-level':
                urlPart1 = '/sat-level';
                break;
        }
        switch (selectedLevel) {
            case 'school' :
                urlPart2 = '/school-dashboard';
                break;
            case 'block':
                urlPart2 = '/block-dashboard';
                break;
            case 'district' :
                urlPart2 = '/district-dashboard';
                break;
            case 'state':
                urlPart2 = '/state-dashboard';
                break;
        }

        if (urlPart1 && urlPart2) {
            if (urlPart1 === '/') {
                urlPart1 = ''
            }
            return <Redirect to={urlPart1 + urlPart2}/>;
        } else if(['/sat-state-dashboard','/e-mentoring'].includes(urlPart1)) {
            return <Redirect to={urlPart1}/>;
        }

        return (
            <header className="App-header">
                <div className="App-background" style={{height: (this.state.height - 84) + 'px'}}>
                    <div className="center-section">
                        <div className="center-banner">
                            <div className={'center-banner-text'}>
                                To visit the Dashboard, select Dashboard and Level from the dropdowns
                            </div>
                        </div>
                        <div className="dashboard-link-container">
                            <div className="selects-wrapper"
                                 style={{flex: 1, padding: '10px', backgroundColor: 'white'}}>
                                <FormControl variant="outlined" style={{width: '100%'}} className={classes.formControl}>
                                    <InputLabel htmlFor="outlined-age-native-simple">Dashboard</InputLabel>
                                    <Select
                                        native
                                        value={this.state.selectedDashboard}
                                        onChange={(e) => this.setLevels(e)}
                                        label="Select Dashboard"
                                        inputProps={{
                                            name: 'schoolType',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                        <option aria-label="None" value=""/>
                                        <option value={'e-vidyalaya'}>e-Vidyalaya Dashboard</option>
                                        <option value={'e-mentoring'}>e-Mentoring Dashboard</option>
                                        <option value={'sat-state-dashboard'}>State Level SAT Dashboard (July - August 2021)</option>
                                        <option value={'sat-elementary'}>SAT Dashboard (July - August 2021) - Elementary</option>
                                        <option value={'sat-sr-secondary'}>SAT Dashboard (July - August 2021) - Sr.Secondary</option>
                                        <option value={'sat-level'}>SAT Dashboard - Old</option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="selects-wrapper"
                                 style={{flex: 1, padding: '10px', backgroundColor: 'white'}}>
                                <FormControl variant="outlined" style={{width: '100%'}} className={classes.formControl}>
                                    <InputLabel htmlFor="outlined-age-native-simple">Level</InputLabel>
                                    <Select
                                        native
                                        value={this.state.selectedLevel}
                                        onChange={(e) => this.setState({selectedLevel: e.target.value})}
                                        label="Select Dashboard Type"
                                        inputProps={{
                                            name: 'dashboardType',
                                            id: 'outlined-age-native-simple',
                                        }}
                                    >
                                        <option aria-label="None" value=""/>
                                        {this.state.levels.map((e,index) => <option key={index} value={e.value}>{e.label}</option>)}
                                    </Select>
                                </FormControl>
                            </div>

                        </div>

                    </div>
                    <div className="home-footer">
                        <div className="center-logo">
                            {logs.map((e,index) => 
                                <img key={index} className="branding-image" src={e.url} alt={e.name}/>
                            )}
                        </div>
                        {/* <div className={'center-download-text'}>
                            <a href="/download-report">Click Here to Download SAT Results Reports</a>
                        </div>
                        <div className="right-logo">
                            <img className="branding-image" src={GovtOfHaryanaLogo} alt="govtOfHPLogo"/>
                        </div> */}
                    </div>
                </div>
            </header>
        );
    }
}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);

