import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withRouter} from 'react-router';
import {Typography, Button} from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "./header"
import {trackEvent} from 'react-with-analytics';
import {getIP} from '../utils/ip';
import ReactPiwik from 'react-piwik';
import {baseURLPrinter} from '../configs'
import {dispatchCustomEvent} from "../utils";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
    loadingStyle: {
        display: 'flex',
        justifyContent: 'center',
    }
};

let url = "";
export default class SrSecondarySchoolDashboard extends Component {

    state = {
        schools: [],
        urlGrade: "",
        selectedSchool: "",
        value: 0,
        width: 0,
        height: 0,
        ip: "",
        loading: true
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.download = this.download.bind(this);
        this.download();
    }

    download() {
        const urls = [
            {name:'schools',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/d24b2fc2/values'},
        ]
        let ctr = 0;
        urls.forEach(element => {
            fetch(element.url)
            .then(response => response.json())
            .then(json => {
                this.setState({[element.name]: json});
                ctr++; 
                if (ctr === urls.length) {
                    this.setState({loading: false});
                }
            });
        });
    }

    onSelectSchool = (selectedSchool) => {
        this.setState({selectedSchool: selectedSchool});
    };

    setLink = () => {
        var customUrl = "";
        if(this.state.selectedSchool.length > 0) {
            this.state.selectedSchool.map((e,index) => {
                if(!index) {
                    customUrl += 'school='+e;
                } else {
                    customUrl += '&school='+e;
                }
            });
        }

        if(customUrl != "") {
            this.setState({urlGrade: `${url}?${customUrl}`});
        } else {
            this.setState({urlGrade: url});
        }
    }

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        url = require('../assets/all_links').SAT_sr_secondary_school;
        this.setState({urlGrade: url});
        dispatchCustomEvent({type: 'titleChange', data: {title: 'SAT School Dashboard - Sr.Secondary'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedSchool !== this.state.selectedSchool) {
            this.setLink();
        }
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value, height, width} = this.state;
        return (
            <div>
                <Header/>
                {this.state.loading ?
                    <div style={styles.loadingStyle}>
                        <CircularProgress />
                    </div>
                : <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"School"}
                                data={this.state.schools}
                                onSelect={this.onSelectSchool}>
                            </SimpleDropdown>
                        </Grid>
                    </Grid>
                </div>}
                {value === 0 && <Iframe ref="metabaseIframeID1"
                                        url={this.state.urlGrade}
                                        width="100%"
                                        height={this.state.height - 184 - 24}
                                        id="metabaseIframeID1"
                                        className={styles.iFrameStyle}
                                        display="initial"
                                        onLoad={this.onLoadIframe}
                                        position="relative"/>}
            </div>
        );
    }
}
