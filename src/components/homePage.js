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
        this.state = {width: 0, height: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getLinkElement = this.getLinkElement.bind(this);
        this.getBranding = this.getBranding.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'Mission Prerna: Supportive Supervision Dashboard'}});
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

    render() {
        const {classes} = this.props;
        const dashboards = [
            {
                text: 'State Dashboard',
                link: '/state-dashboard/'
            },
            {
                text: 'District Dashboard',
                link: '/district-dashboard/'
            },
            {
                text: 'Block Dashboard',
                link: '/block-dashboard/'
            },
            {
                text: 'School Dashboard',
                link: '/school-dashboard/'
            }
        ];

        const {selectedSchoolType, selectedDashboardType} = this.state;
        let urlPart1, urlPart2;
        switch (selectedSchoolType) {
            case 'elementary' :
                urlPart1 = '/elementary';
                break;
            case 'secondary':
                urlPart1 = '/';
                break;
        }
        switch (selectedDashboardType) {
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
            console.log(urlPart1 + urlPart2);
            return <Redirect to={urlPart1 + urlPart2}/>;

        }
        return (
            <header className="App-header">
                <div className="App-background" style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    height: (this.state.height - 84) + 'px'
                }}>
                    <div className="prerna-home-background">
                        <div className="prerna-home-background-inner">
                            <div className={'center-download-text'}>
                                <div>This Dashboard shows the compliance level and insights from the school visits
                                    recorded on Prerna Gunvatta App.
                                </div>
                                <br/>
                                <div><strong>यह डैशबोर्ड मेंटर्स यानि SRGs, ARPs एवं DIET मेंटर्स द्वारा प्रेरणा
                                    गुणवत्ता एप पर दर्ज की गई मासिक स्कूल विज़िट की जानकारी को दर्शाता है ।</strong>
                                </div>
                            </div>
                            <div className="home-link-item">
                                <a href="/e-supportive/state-district-dashboard">E-Supportive Supervision Dashboard: State and District Officers
                                    <br/>
                                    <div style={{marginTop: '5px'}}>यदि आप एक जिला अधिकारी है (DM, CDO, DIET प्राचार्य, BSA, DC, SRG आदि)</div>
                                </a>
                            </div>
                            <div className="home-link-item">
                                <a href="/e-supportive/block-dashboard">Supportive Supervision Dashboard: State and District Officers
                                    <br/>
                                    <div style={{marginTop: '5px'}}>यदि आप एक जिला अधिकारी है (DM, CDO, DIET प्राचार्य, BSA, DC, SRG आदि)</div>
                                </a>
                            </div>
                            <div className="home-link-item">
                                <a href="/supportive/state-district-dashboard">E-Supportive Supervision Dashboard: Block Officers
                                    <br/>
                                    <div style={{marginTop: '5px'}}>यदि आप एक ब्लॉक अधिकारी है (BEO, ARP, DIET मेंटर, आदि)
                                    </div>
                                </a>
                            </div>
                            <div className="home-link-item">
                                <a href="/supportive/block-dashboard">Supportive Supervision Dashboard: Block Officers
                                    <br/>
                                    <div style={{marginTop: '5px'}}>यदि आप एक ब्लॉक अधिकारी है (BEO, ARP, DIET मेंटर, आदि)
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/*<div className="home-footer">*/}
                    {/*    <div className="left-logo">*/}
                    {/*        <img className="branding-image" src={SakshamHaryanaLogo} alt="govtOfHPLogo"/>*/}
                    {/*    </div>*/}
                    {/*    <div className={'center-download-text'}>*/}
                    {/*        /!*<a href="/download-report">Click Here to Download SAT Results Reports</a>*!/*/}
                    {/*    </div>*/}
                    {/*    <div className="right-logo">*/}
                    {/*        <img className="branding-image" src={GovtOfHaryanaLogo} alt="govtOfHPLogo"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </header>
        );
    }
}

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);

