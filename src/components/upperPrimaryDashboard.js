import React, {Component} from "react";
import SimpleDropdown from "./simpleDropdown";
import Iframe from "react-iframe";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Header from "../components/header";
import {trackEvent} from "react-with-analytics";
import {getIP} from "./../utils/ip";
import ReactPiwik from "react-piwik";
import {dispatchCustomEvent} from "../utils";
import ReactGA from 'react-ga';

import districtBlockMaster from "../content/districtBlockMaster";
import npMaster from "../content/np-master";
import mentorsMaster from "../content/mentorsMaster";
import schoolMaster from "../content/schoolMaster";

const styles = {
    iFrameStyle: {
        pointerEvents: "none"
    }
};
let url = require('../assets/all_links').secondary_block;

// const baseURL = 'http://134.209.177.56:3000'
const baseURL = "http://159.65.152.166:3000/public/dashboard/6cef9e6a-d892-4a0c-9e6b-7e1823e69043?";

function dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth, '01'].join('-'));
        }
    }
    return dates;
}

let months = [];
export default class UpperPrimaryDashboard extends Component {
    state = {
        allData: [],
        districts: [],
        blocks: [],
        nyayPanchayats: [],
        selectedNyayPanchayat: '',
        months: [],
        urlGrade: baseURL,
        urlLO: "",
        selectedBlock: "",
        selectedCluster: "",
        value: 0,
        years: ["2020", "2021"],
        selectedYear: "2021",
        width: 0,
        height: 0,
        ip: ""
    };

    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.onSelectDistrict = this.onSelectDistrict.bind(this);
        this.download = this.download.bind(this);
        this.sentenceCase = this.sentenceCase.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.loadData();
        console.log(months);

    }

    loadAllJSONFiles = () => {
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const districts = [];
        districtBlockMaster.forEach((d) => {
            if (districts.indexOf(d['District']) === -1)
                districts.push(d['District'])
        });
        this.setState({months, districts});
    };

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    sentenceCase(str) {
        if (str === null || str === "") return false;
        else str = str.toString();

        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    download(url) {
        // fetch(url)
        //     .then(response => response.json())
        //     .then(json => {
        //         var districts = json['districts'];
        //         this.setState({allData: json, districts: districts});
        //     });
    }

    loadData() {
        const url = process.env.PUBLIC_URL + "/data.json";
        this.download(url);
    }

    onSelectDistrict = district => {
        const blocks = [];
        districtBlockMaster.forEach((d) => {
            if (blocks.indexOf(d['Block']) === -1 && d['District'] === district)
                blocks.push(d['Block'])
        });
        ReactGA.event({
            category: 'District Filter Change',
            action: 'District - ' + district,
            label: 'Filter Change'
        });
        this.setState({
            selectedDistrict: district,
            blocks: blocks,
            selectedBlock: '',
            nyayPanchayats: [],
            selectedNyayPanchayat: ''
        })
    };

    onSelectBlock = block => {
        const nyayPanchayats = [];
        npMaster.forEach((d) => {
            if (d['NyayPanchayat'] && d['Block'] && nyayPanchayats.indexOf(d['NyayPanchayat']) === -1 && d['Block'].toLowerCase() === block.toLowerCase())
                nyayPanchayats.push(d['NyayPanchayat'])
        });

        ReactGA.event({
            category: 'Block Filter Change',
            action: 'Block - ' + block,
            label: 'Filter Change'
        });
        this.setState({
            selectedBlock: block,
            nyayPanchayats: nyayPanchayats,
            selectedNyayPanchayat: ''
        })
    };
    onSelectNyayPanchayat = nyayPanchayat => {
        ReactGA.event({
            category: 'NP Filter Change',
            action: 'NP - ' + nyayPanchayat,
            label: 'Filter Change'
        });
        this.setState({
            selectedNyayPanchayat: nyayPanchayat
        })
    };
    nyayPanchayat = nyayPanchayat => {
        // if (this.state.selectedYear !== "") {
        //     const filters = {
        //         tab: this.state.value === 0 ? "Grade" : "LO",
        //         selectedYear: this.state.selectedYear,
        //         district: this.state.selectedDistrict,
        //         block: block,
        //         ip: this.state.ip
        //     };
        //     trackEvent("Block Dashbaord", "View", JSON.stringify(filters));
        //     ReactPiwik.push([
        //         "trackEvent",
        //         "Block Dashbaord",
        //         "View",
        //         JSON.stringify(filters),
        //         JSON.stringify(filters)
        //     ]);
        //     this.setState({
        //         selectedBlock: block,
        //         urlGrade: `${url}?block=${block}&district=${this.state.selectedDistrict}`,
        //         urlLO: `${url}?block=${block}`
        //     });
        // }
    };

    handleChange = (event, value) => {
        if (value !== 2)
            this.setState({value}, () => {
                console.log(this.state.ip);
                const filters = {
                    tab: this.state.value === 0 ? "Grade" : "LO",
                    selectedYear: this.state.selectedYear,
                    district: this.state.selectedDistrict,
                    block: this.state.selectedBlock,
                    ip: this.state.ip
                };
                trackEvent("Block Dashbaord", "View", JSON.stringify(filters));
                ReactPiwik.push([
                    "trackEvent",
                    "Block Dashbaord",
                    "View",
                    JSON.stringify(filters),
                    JSON.stringify(filters)
                ]);
            });
    };

    onYearChange = selectedYear => {

        ReactGA.event({
            category: 'Year Filter Change',
            action: 'Year - ' + selectedYear,
            label: 'Filter Change'
        });
        if (this.state.selectedBlock !== "") {
            this.setState({selectedYear: selectedYear}, () => {
                this.onSelectBlock(this.state.selectedBlock);
            });
        } else {
            this.setState({selectedYear: selectedYear});
        }
    };

    onMonthChange = selectedMonth => {
        ReactGA.event({
            category: 'Month Filter Change',
            action: 'Month - ' + selectedMonth,
            label: 'Filter Change'
        });
        this.setState({selectedMonth})
    };

    showFile(blob) {
        console.log("Inside show file");
        var newBlob = new Blob([blob], {type: "application/pdf"});

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement("a");
        link.href = data;
        link.download = "BlockDashboard.pdf";
        link.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(data);
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
        ReactPiwik.push([
            "trackEvent",
            "Block Dashbaord",
            "Download Started",
            tab,
            tab
        ]);
        fetch(
            "https://html-printer.samagra.io/export/pdf?url=" +
            encodeURIComponent(url)
        )
        // fetch("http://0.0.0.0:3022/export/pdf?url=" + url)
            .then(r => r.blob())
            .then(s => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push([
                    "trackEvent",
                    "Block Dashbaord",
                    "Download Completed",
                    tab,
                    tab
                ]);
            });
    }

    componentDidMount() {
        this.loadAllJSONFiles();
        getIP().then(ip => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'Upper Primary: School Insights Dashboard'}});
        if (typeof window !== "undefined") {
            ReactGA.initialize('UA-157866469-2', {debug: true, gaOptions: { siteSpeedSampleRate: 100 }});
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    getUrlToLoad = () => {
        let result = this.state.urlGrade;
        if (this.state.selectedYear) {
            result += "year=" + this.state.selectedYear + "&";
        }
        if (this.state.selectedMonth) {
            result += "month_=" + this.state.selectedMonth + "&";
        }
        if (this.state.selectedDistrict) {
            result += "district=" + this.state.selectedDistrict + "&";
        }
        if (this.state.selectedBlock) {
            result += "block=" + this.state.selectedBlock + "&";
        }
        if (this.state.selectedNyayPanchayat) {
            result += "nyay_panchayat=" + this.state.selectedNyayPanchayat;
        }
        return result;
    }

    render() {
        const {value} = this.state;
        console.log(this.state);
        const urlToLoad = this.getUrlToLoad();
        return (
            <div>
                <Header/>
                <div>
                    <Grid container spacing={24}>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"Year"}
                                data={this.state.years}
                                onSelect={this.onYearChange}
                            />
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"Months"}
                                data={this.state.months}
                                onSelect={this.onMonthChange}
                            />
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"District"}
                                data={this.state.districts}
                                onSelect={this.onSelectDistrict}
                            />
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"Block"}
                                data={this.state.blocks}
                                onSelect={this.onSelectBlock}
                            />
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                title={"Nyay Panchayat"}
                                data={this.state.nyayPanchayats}
                                onSelect={this.onSelectNyayPanchayat}
                            />
                        </Grid>
                    </Grid>
                </div>
                {/*<Tabs value={value} onChange={this.handleChange}>*/}
                {/*    <Tab label="Grade"/>*/}
                {/*    <Tab label="Learning Outcome"/>*/}
                {/*    <Tab*/}
                {/*        icon={<SaveAlt/>}*/}
                {/*        className="download"*/}
                {/*        onClick={() => {*/}
                {/*            this.downloadPDF();*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</Tabs>*/}
                <Iframe
                    ref="metabaseIframeID1"
                    url={urlToLoad}
                    width="100%"
                    height={this.state.height - 184 - 24}
                    id="metabaseIframeID1"
                    className={styles.iFrameStyle}
                    display="initial"
                    onLoad={this.onLoadIframe}
                    position="relative"
                />
            </div>
        );
    }
}
