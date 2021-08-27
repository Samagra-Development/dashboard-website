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
    loadingStyle: {
        display: 'flex',
        justifyContent: 'center',
    }
}
// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'https://saksham.monitoring.dashboard.samagra.io'
let url = require('../assets/all_links').secondary_state;

export default class EmentoringDashboard extends Component {
    state = {
        urlGrade: `${url}`,
        urlLO: `${url}`,
        month_and_year: '',
        districts: [],
        blocks: [],
        valueMonthAndYear: "",
        selectedDistrict: "",
        selectedBlock: "",
        value: 0,
        width: 0,
        height: 0,
        loading: true
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.download = this.download.bind(this);
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

    download() {
        const urls = [
            {name:'districts',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/85ce72c8-3206-49a5-b7c8-28c2a4272ec0/params/450f89fc/values'},
            {name:'blocks',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/85ce72c8-3206-49a5-b7c8-28c2a4272ec0/params/dbd27c0d/values'},
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

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value});
    };

    onSetMonthAndYear = (event) => {
        console.log(event.target.value);
        this.setState({valueMonthAndYear: event.target.value});
    };

    onSelectDistrict = (selectedDistrict) => {
        this.setState({selectedDistrict: selectedDistrict});
    };

    onSelectBlock = (selectedBlock) => {
        this.setState({selectedBlock: selectedBlock});
    };

    setLink = () => {
        var customUrl = "";
        if(this.state.valueMonthAndYear != "") {
            customUrl += 'month_and_year='+this.state.valueMonthAndYear;
        }

        if(this.state.selectedDistrict.length > 0) {
            this.state.selectedDistrict.map((e,index) => {
                if(!index && this.state.valueMonthAndYear == "") {
                    customUrl += 'district='+e;
                } else {
                    customUrl += '&district='+e;
                }
            });
        }

        if(this.state.selectedBlock.length > 0) {
            this.state.selectedBlock.map((e,index) => {
                if(!index && this.state.valueMonthAndYear == "" && this.state.selectedDistrict.length <= 0) {
                    customUrl += 'block='+e;
                } else {
                    customUrl += '&block='+e;
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
        if (typeof window !== "undefined" && window.location.href.indexOf("/e-mentoring") > -1) {
            url = require('../assets/all_links').e_Mentoring_Dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'e-Mentoring 2.0 Dashboard'}});
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
        if (prevState.valueMonthAndYear !== this.state.valueMonthAndYear
            || prevState.selectedDistrict !== this.state.selectedDistrict
            || prevState.selectedBlock !== this.state.selectedBlock) {
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
                {this.state.loading ?
                    <div style={styles.loadingStyle}>
                        <CircularProgress />
                    </div>
                : <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                }}
                            >
                                <TextField
                                    label="Month & Year"
                                    type="date"
                                    variant="outlined"
                                    onChange={this.onSetMonthAndYear}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"District"}
                                data={this.state.districts}
                                onSelect={this.onSelectDistrict}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Block"}
                                data={this.state.blocks}
                                onSelect={this.onSelectBlock}>
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
