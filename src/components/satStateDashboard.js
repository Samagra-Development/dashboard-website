import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "./header"
import {trackEvent} from 'react-with-analytics';
import {getIP} from '../utils/ip';
import ReactPiwik from 'react-piwik';
import {dispatchCustomEvent} from "../utils";
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
    lodingStyle: {
        display: 'flex',
        justifyContent: 'center',
    }
}
// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'https://saksham.monitoring.dashboard.samagra.io'
let url = require('../assets/all_links').secondary_state;

export default class SatStateDashboard extends Component {
    state = {
        urlGrade: `${url}`,
        urlLO: `${url}`,
        event_names: [],
        grade_categories: [],
        selectedEventName: "",
        selectedGradeCategory: "",
        value: 0,
        width: 0,
        height: 0,
        loding: true
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.download = this.download.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.download();
    }

    showFile(blob) {
        console.log("Inside show file")
        var newBlob = new Blob([blob], {type: "application/pdf"})

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download = "StateDashboard.pdf";
        link.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(data)
        }, 100);
    }

    downloadPDF() {
        let url = "";
        if (this.state.value === 0) {
            url = this.state.urlGrade;
        } else {
            url = this.state.urlLO;
        }
        const tab = this.state.value === 0 ? "Grade" : "LO";
        ReactPiwik.push(['trackEvent', 'State Dashbaord', 'Download Started', tab, tab]);
        fetch("https://html-printer.samagra.io/export/pdf?url=" + url)
        // fetch("http://0.0.0.0:3022/export/pdf?url=" + url)
            .then(r => r.blob())
            .then((s) => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push(['trackEvent', 'State Dashbaord', 'Download Completed', tab, tab]);
            });
    }

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value});
    };

    download() {
        const urls = [
            {name:'event_names',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/7d896ea6-dcd3-4631-bc64-0444f68391dd/params/e6627e9c/values'},
            {name:'grade_categories',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/7d896ea6-dcd3-4631-bc64-0444f68391dd/params/23304afb/values'},
        ]
        let ctr = 0;
        urls.forEach(element => {
            fetch(element.url)
            .then(response => response.json())
            .then(json => {
                this.setState({[element.name]: json});
                ctr++; 
                if (ctr === urls.length) {
                    this.setState({loding: false});
                }
            });
        });
    }

    onSelectEventName = (setEventName) => {
        this.setState({selectedEventName: setEventName});
    }

    onSelectGradeCategory = (setGradeCategory) => {
        this.setState({selectedGradeCategory: setGradeCategory});
    }

    setLink = () => {
        var customUrl = "";
        if(this.state.selectedEventName.length > 0) {
            this.state.selectedEventName.map((e,index) => {
                if(!index) {
                    customUrl += 'event_name='+e;
                } else {
                    customUrl += '&event_name='+e;
                }
            });
        }

        if(this.state.selectedGradeCategory.length > 0) {
            this.state.selectedGradeCategory.map((e,index) => {
                if(!index && this.state.selectedEventName.length <= 0) {
                    customUrl += 'grade_category='+e;
                } else {
                    customUrl += '&grade_category='+e;
                }
            });
        }
        
        if(customUrl != "") {
            this.setState({urlGrade: `${url}?${customUrl}`});
            this.setState({urlLO: `${url}?${customUrl}`});
        } else {
            this.setState({urlGrade: url});
            this.setState({urlLO: url});
        }
    }

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (typeof window !== "undefined" && window.location.href.indexOf("/sat-level/") > -1) {
            url = require('../assets/all_links').State_Level_SAT_Dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'State Dashboard'}});
        } else {
            url = require('../assets/all_links').secondary_state;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Secondary State Level Dashboard'}});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedEventName !== this.state.selectedEventName
            || prevState.selectedGradeCategory !== this.state.selectedGradeCategory) {
            this.setLink();
        }
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value, urlGrade} = this.state;
        console.log(urlGrade);
        return (
            <div>
                <Header/>

                {this.state.loding ?
                    <div style={styles.lodingStyle}>
                        <CircularProgress />
                    </div>
                : <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Event Name"}
                                data={this.state.event_names}
                                onSelect={this.onSelectEventName}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Grade Category"}
                                data={this.state.grade_categories}
                                onSelect={this.onSelectGradeCategory}>
                            </SimpleDropdown>
                        </Grid>
                    </Grid>
                </div>}
                {value === 0 && <Iframe ref="metabaseIframeID1"
                                        url={this.state.urlGrade}
                                        width="100%"
                                        height={this.state.height - 64 - 48 - 24}
                                        id="metabaseIframeID1"
                                        className={styles.iFrameStyle}
                                        display="initial"
                                        onLoad={this.onLoadIframe}
                                        position="relative"/>}

                {value === 1 && <Iframe ref="metabaseIframeID2"
                                        url={this.state.urlLO}
                                        width="100%"
                                        height={this.state.height - 64 - 48 - 24}
                                        id="metabaseIframeID2"
                                        className={styles.iFrameStyle}
                                        display="initial"
                                        onLoad={this.onLoadIframe}
                                        position="relative"/>}
            </div>
        );
    }
}
