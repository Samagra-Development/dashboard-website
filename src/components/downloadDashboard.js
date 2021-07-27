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

const styles = {
    iFrameStyle: {
        pointerEvents: "none"
    }
};

// const baseURL = 'http://134.209.177.56:3000'
const baseURL = "http://165.22.209.213:3000";
export default class DownloadReportDashboard extends Component {
    state = {
        allData: [],
        districts: [],
        blocks: [],
        urlGrade: "",
        urlLO: "",
        selectedBlock: "",
        selectedCluster: "",
        value: 0,
        years: ["2018-19", "2017-18"],
        selectedYear: "2018-19",
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
    }

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

    onSelectDistrict = district => {
        const blocks = this.state.allData['Blocks-' + district];
        this.setState({
            blocks: blocks,
            selectedDistrict: district,
            urlGrade: `${baseURL}/public/question/0ee2a162-b8fe-48aa-ae8a-6b7ed0bf6ab7?district=${district}`,
            urlLO: `${baseURL}/public/question/0ee2a162-b8fe-48aa-ae8a-6b7ed0bf6ab7?district=${district}`
        });
    };

    onSelectBlock = block => {
        if (this.state.selectedYear !== "") {
            const filters = {
                tab: this.state.value === 0 ? "Grade" : "LO",
                selectedYear: this.state.selectedYear,
                district: this.state.selectedDistrict,
                block: block,
                ip: this.state.ip
            };
            // trackEvent("Block Dashbaord", "View", JSON.stringify(filters));
            // ReactPiwik.push([
            //     "trackEvent",
            //     "Block Dashbaord",
            //     "View",
            //     JSON.stringify(filters),
            //     JSON.stringify(filters)
            // ]);
            this.setState({
                selectedBlock: block,
                urlGrade: `${baseURL}/public/question/0ee2a162-b8fe-48aa-ae8a-6b7ed0bf6ab7?block=${block}&district=${this.state.selectedDistrict}`,
                urlLO: `${baseURL}/public/question/0ee2a162-b8fe-48aa-ae8a-6b7ed0bf6ab7?block=${block}&district=${this.state.selectedDistrict}`
            });
        }
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
        console.log(this.state.selectedBlock);
        if (this.state.selectedBlock !== "") {
            this.setState({selectedYear: selectedYear}, () => {
                this.onSelectBlock(this.state.selectedBlock);
            });
        } else {
            this.setState({selectedYear: selectedYear});
        }
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
        getIP().then(ip => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);
        dispatchCustomEvent({type: 'titleChange', data: {title: 'Download Report'}});
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value} = this.state;
        return (
            <div>
                <Header/>
                <div>
                    <Grid container spacing={24}>
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
                {value === 0 && (
                    <Iframe
                        ref="metabaseIframeID1"
                        url={this.state.urlGrade}
                        width="100%"
                        height={this.state.height - 184 - 24}
                        id="metabaseIframeID1"
                        className={styles.iFrameStyle}
                        display="initial"
                        onLoad={this.onLoadIframe}
                        position="relative"
                    />
                )}

                {value === 1 && (
                    <Iframe
                        ref="metabaseIframeID2"
                        url={this.state.urlLO}
                        width="100%"
                        height={this.state.height - 184 - 24}
                        id="metabaseIframeID2"
                        className={styles.iFrameStyle}
                        display="initial"
                        onLoad={this.onLoadIframe}
                        position="relative"
                    />
                )}
            </div>
        );
    }
}
