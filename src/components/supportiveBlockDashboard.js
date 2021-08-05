import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
const baseURL = 'http://165.22.209.213:3000'
let url = require('../assets/all_links').secondary_state;

export default class SupportiveBlockDashboard extends Component {
    state = {
        urlGrade: `${url}`,
        urlLO: `${url}`,
        years: [],
        months: [],
        districts: [],
        blocks: [],
        selectedYear: [],
        selectedMonth: [],
        selectedDistrict: [],
        selectedBlock: [],
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
            {name:'years',url:'https://dashboard.mp.samagra.io/api/public/dashboard/1528e874-eac2-48e1-a6cb-7488e2011e40/params/66a226bd/values'},
            {name:'months',url:'https://dashboard.mp.samagra.io/api/public/dashboard/1528e874-eac2-48e1-a6cb-7488e2011e40/params/c4640f3a/values'},
            {name:'districts',url:'https://dashboard.mp.samagra.io/api/public/dashboard/1528e874-eac2-48e1-a6cb-7488e2011e40/params/1f5d3b7d/values'},
            {name:'blocks',url:'https://dashboard.mp.samagra.io/api/public/dashboard/1528e874-eac2-48e1-a6cb-7488e2011e40/params/ae70b2f5/values'},
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

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value});
    };

    onSelectYear = (selectedYear) => {
        this.setState({selectedYear: selectedYear});
    };

    onSelectMonth = (selectedMonth) => {
        this.setState({selectedMonth: selectedMonth});
    };

    onSelectDistrict = (selectedDistrict) => {
        this.setState({selectedDistrict: selectedDistrict});
    };

    onSelectBlock = (selectedBlock) => {
        this.setState({selectedBlock: selectedBlock});
    };

    setLink = () => {
        var customUrl = "";

        if(this.state.selectedYear.length > 0) {
            this.state.selectedYear.map((e,index) => {
                if(!index) {
                    customUrl += 'year='+e;
                } else {
                    customUrl += '&year='+e;
                }
            });
        }

        if(this.state.selectedMonth.length > 0) {
            this.state.selectedMonth.map((e,index) => {
                if(!index && this.state.selectedYear.length <= 0) {
                    customUrl += 'month='+e;
                } else {
                    customUrl += '&month='+e;
                }
            });
        }

        if(this.state.selectedDistrict.length > 0) {
            this.state.selectedDistrict.map((e,index) => {
                if(!index && this.state.selectedYear.length <= 0 && this.state.selectedMonth.length <= 0) {
                    customUrl += 'district='+e;
                } else {
                    customUrl += '&district='+e;
                }
            });
        }

        if(this.state.selectedBlock.length > 0) {
            this.state.selectedBlock.map((e,index) => {
                if(!index && this.state.selectedYear.length <= 0 && this.state.selectedMonth.length <= 0 && this.state.selectedDistrict.length <= 0) {
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
        if (typeof window !== "undefined" && window.location.href.indexOf("/e-supportive/") > -1) {
            url = require('../assets/all_links').e_supportive_block_dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'E-Supportive Supervision Dashboard: Block Officers'}});
        } else if (typeof window !== "undefined" && window.location.href.indexOf("/supportive/") > -1) {
            url = require('../assets/all_links').supportive_block_dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Supportive Supervision Dashboard: Block Officers'}});
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
        if (prevState.selectedYear !== this.state.selectedYear
            || prevState.selectedMonth !== this.state.selectedMonth
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
                {this.state.loding ?
                    <div style={styles.lodingStyle}>
                        <CircularProgress />
                    </div>
                : <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Year"}
                                data={this.state.years}
                                onSelect={this.onSelectYear}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Month"}
                                data={this.state.months}
                                onSelect={this.onSelectMonth}>
                            </SimpleDropdown>
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
