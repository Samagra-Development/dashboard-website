import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "../components/header";
import {trackEvent} from 'react-with-analytics';
import {getIP} from './../utils/ip';
import ReactPiwik from 'react-piwik';
import {dispatchCustomEvent} from "../utils";

const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
}
let url = require('../assets/all_links').secondary_district;

// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'http://165.22.209.213:3000';
export default class DistrictDashboard extends Component {

    state = {
        allData: [],
        districts: [],
        value: 0,
        width: 0,
        height: 0,
        years: ["2018-19", "2017-18"],
        selectedYear: "",
        selectedDistrict: "",
        ip: "",
    };

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.download = this.download.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.onSelectDistrict = this.onSelectDistrict.bind(this);
        this.loadData();
    }

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value}, () => {
            const filters = {
                tab: this.state.value === 0 ? "Grade" : "LO",
                selectedYear: this.state.selectedYear,
                district: this.state.selectedDistrict,
                ip: this.state.ip
            }
            trackEvent('District Dashbaord', 'View', JSON.stringify(filters));
            ReactPiwik.push(['trackEvent', 'District Dashbaord', 'View', JSON.stringify(filters), JSON.stringify(filters)]);
        });
    };

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
        link.download = "DistrictDashboard.pdf";
        link.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(data)
        }, 100);
    }

    sentenceCase(str) {
        if ((str === null) || (str === ''))
            return false;
        else
            str = str.toString();

        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    download(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => {
                var districts = json['districts'];
                this.setState({allData: json, districts: districts});
            });
    }

    loadData() {
        const url = process.env.PUBLIC_URL + "/data.json";
        this.download(url);
    }

    downloadPDF() {
        let url = "";
        if (this.state.value === 0) {
            url = this.state.urlGrade;
        } else {
            url = this.state.urlLO;
        }
        const tab = this.state.value === 0 ? "Grade" : "LO";
        ReactPiwik.push(['trackEvent', 'District Dashbaord', 'Download Started', tab, tab]);
        fetch("https://html-printer.samagra.io/export/pdf?url=" + url)
            .then(r => r.blob())
            .then((s) => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push(['trackEvent', 'District Dashbaord', 'Download Completed', tab, tab]);
            });
    }

    onSelectDistrict = (district) => {
        district = encodeURIComponent(district);
        this.setState({
            selectedDistrict: district,
            urlGrade: `${url}?district=${district}`,
            urlLO: `${url}?district=${district}`
        })
    }

    onYearChange = (selectedYear) => {
        if (this.state.selectedDistrict !== "") {
            this.setState({selectedYear: selectedYear}, () => {
                this.onSelectDistrict(this.state.selectedDistrict);
            });
        } else {
            this.setState({selectedYear: selectedYear});
        }
    }

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (typeof window !== "undefined" && window.location.href.indexOf("/elementary/") > -1) {
            url = require('../assets/all_links').elementary_district;
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Elementary District Level Dashboard'}});
        } else if (typeof window !== "undefined" && window.location.href.indexOf("/e-vidyalaya/") > -1) {
            url = require('../assets/all_links').e_Vidyalaya_District_Dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'e-Vidyalaya Dashboard - District Level'}});
        } else if (typeof window !== "undefined" && window.location.href.indexOf("/sat-level/") > -1) {
            url = require('../assets/all_links').District_Level_SAT_Dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'District Dashboard'}});
        } else {
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Secondary District Level Dashboard'}});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value} = this.state;
        return (
            <div>
                <Header/>
                {/* <div>
                    <Grid container spacing={24}>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"District"}
                                data={this.state.districts}
                                onSelect={this.onSelectDistrict}>
                            </SimpleDropdown>
                        </Grid>
                    </Grid>
                </div>
                <Tabs value={value} onChange={this.handleChange}>
                   <Tab label="Grade"/>
                   <Tab label="Learning Outcome"/>
                   <Tab
                       icon={<SaveAlt/>}
                       className="download"
                       onClick={() => {
                           this.downloadPDF()
                       }}>
                   </Tab>
                </Tabs> */}
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
