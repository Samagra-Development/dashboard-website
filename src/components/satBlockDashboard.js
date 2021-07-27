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

const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
}
// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'http://165.22.209.213:3000'
let url = require('../assets/all_links').secondary_state;

export default class SatBlockDashboard extends Component {
    state = {
        urlGrade: `${url}`,
        urlLO: `${url}`,
        blocks: [],
        grade_categories: [],
        subjects: [],
        sat_events: [],
        selectedBlock: "",
        selectedGradeCategory: "",
        selectedSubject: "",
        selectedSatEvent: "",
        value: 0,
        width: 0,
        height: 0
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
            {name:'blocks',url:'http://165.22.209.213:3000/api/public/dashboard/33f9d05f-2d4e-462a-91a2-08a653909aad/params/5ef3ddf0/values'},
            {name:'sat_events',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/e64d15cb/values'},
            {name:'grade_categories',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/d42ba65/values'},
            {name:'subjects',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/7c5fd706/values'},
        ]
        urls.forEach(element => {
            fetch(element.url)
            .then(response => response.json())
            .then(json => {
                this.setState({[element.name]: json});
            });
        });
    }

    onSelectBlock = (selectedBlock) => {
        this.setState({selectedBlock: selectedBlock});
    };

    onSelectSatEvent = (satEvent) => {
        this.setState({selectedSatEvent: satEvent});
    }

    onSelectGradeCategory = (setGradeCategory) => {
        this.setState({selectedGradeCategory: setGradeCategory});
    }

    onSelectSubject = (setSubject) => {
        this.setState({selectedSubject: setSubject});
    }

    setLink = () => {
        var customUrl = "";
        if(this.state.selectedBlock.length > 0) {
            this.state.selectedBlock.map((e,index) => {
                if(!index) {
                    customUrl += 'block='+e;
                } else {
                    customUrl += '&block='+e;
                }
            });
        }

        if(this.state.selectedGradeCategory.length > 0) {
            this.state.selectedGradeCategory.map((e,index) => {
                if(!index && this.state.selectedBlock.length <= 0) {
                    customUrl += 'grade_category_='+e;
                } else {
                    customUrl += '&grade_category_='+e;
                }
            });
        }

        if(this.state.selectedSubject.length > 0) {
            this.state.selectedSubject.map((e,index) => {
                if(!index && this.state.selectedBlock.length <= 0 && this.state.selectedGradeCategory.length <= 0) {
                    customUrl += 'subject='+e;
                } else {
                    customUrl += '&subject='+e;
                }
            });
        }

        if(this.state.selectedSatEvent.length > 0) {
            this.state.selectedSatEvent.map((e,index) => {
                if(!index && this.state.selectedBlock.length <= 0 && this.state.selectedGradeCategory.length <= 0 && this.state.selectedSubject.length <= 0) {
                    customUrl += 'sat_event='+e;
                } else {
                    customUrl += '&sat_event='+e;
                }
            });
        }
        console.log('customUrl',customUrl);
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
            url = require('../assets/all_links').Block_Level_SAT_Dashboard;
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
        if (prevState.selectedBlock !== this.state.selectedBlock
            || prevState.selectedGradeCategory !== this.state.selectedGradeCategory
            || prevState.selectedSubject !== this.state.selectedSubject
            || prevState.selectedSatEvent !== this.state.selectedSatEvent) {
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
                <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Block"}
                                data={this.state.blocks}
                                onSelect={this.onSelectBlock}>
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
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Subject"}
                                data={this.state.subjects}
                                onSelect={this.onSelectSubject}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"SAT Event"}
                                data={this.state.sat_events}
                                onSelect={this.onSelectSatEvent}>
                            </SimpleDropdown>
                        </Grid>
                    </Grid>
                </div>
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
