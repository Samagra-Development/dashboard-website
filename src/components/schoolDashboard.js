import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withRouter} from 'react-router';
import {Typography, Button} from '@material-ui/core';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "../components/header"
import {trackEvent} from 'react-with-analytics';
import {getIP} from './../utils/ip';
import ReactPiwik from 'react-piwik';
import {baseURLPrinter} from './../configs'
import {dispatchCustomEvent} from "../utils";

let url = require('../assets/all_links').secondary_school;
const styles = {
    iFrameStyle: {
        pointerEvents: 'none'
    },
};


// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'http://165.22.209.213:3000'

class SchoolDashboard extends Component {

    state = {
        allData: [],
        schools: [],
        sat_events: [],
        grade_categories: [],
        subjects: [],
        url: "",
        selectedBlock: "",
        selectedCluster: "",
        selectedDistrict: "",
        selectedSchool: "",
        value: 0,
        years: ["2018-19", "2017-18"],
        selectedYear: "2018-19",
        width: 0,
        height: 0,
        ip: "",
        urlValue:""
    };

    handleChange = (event, value) => {
        if (value !== 2) this.setState({value}, () => {
            const filters = {
                tab: this.state.value === 0 ? "Grade" : "LO",
                selectedYear: this.state.selectedYear,
                district: this.state.selectedDistrict,
                block: this.state.selectedBlock,
                cluster: this.state.selectedCluster,
                school: this.state.selectedSchool,
                ip: this.state.ip
            }
            trackEvent('School Dashbaord', 'View', JSON.stringify(filters));
            ReactPiwik.push(['trackEvent', 'School Dashbaord', 'View', JSON.stringify(filters), JSON.stringify(filters)]);
        });
    };

    constructor(props) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onSelectDistrict = this.onSelectDistrict.bind(this);
        this.download = this.download.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.showFile = this.showFile.bind(this);
        this.downloadPDF = this.downloadPDF.bind(this);
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
        link.download = "SchoolDashboard.pdf";
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
        ReactPiwik.push(['trackEvent', 'School Dashbaord', 'Download Started', tab, tab]);
        fetch(baseURLPrinter + encodeURIComponent(url))
        // fetch("http://0.0.0.0:3022/export/pdf?url=" + url)
            .then(r => r.blob())
            .then((s) => {
                console.log("Calling showFile now");
                this.showFile(s);
                ReactPiwik.push(['trackEvent', 'School Dashbaord', 'Download Completed', tab, tab]);
            });
    }


    download() {
        const urls = [
            {name:'schools',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/d24b2fc2/values'},
            {name:'sat_events',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/e64d15cb/values'},
            {name:'grade_categories',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/d42ba65/values'},
            {name:'subjects',url:'http://165.22.209.213:3000/api/public/dashboard/c9cdab6a-a0de-4862-aae2-429f94d08e04/params/7c5fd706/values'},
        ]
        urls.forEach(element => {
            console.log(element);
            fetch(element.url)
            .then(response => response.json())
            .then(json => {
                console.log('json',json);
                this.setState({[element.name]: json});
            });
        });
    }

    onSelectDistrict = (district) => {
        const blocks = this.state.allData['Blocks-' + district];
        this.setState({
            blocks: blocks,
            selectedDistrict: district,
            urlGrade: `${url}?district=${district}`,
            urlLO: `${url}?district=${district}`
        });
    }

    onSelectBlock = (block) => {
        const schools = this.state.allData['Blocks-' + this.state.selectedDistrict + '-Schools-' + block];
        console.log("Block selected", block, 'Blocks-' + this.state.selectedDistrict + '-Schools-' + block);
        // this.setState({schools: schools, selectedBlock: block});
        this.setState({
            schools: schools, selectedBlock: block,
            urlGrade: `${url}?block=${block}`,
            urlLO: `${url}?block=${block}`
        });
    }

    onSelectCluster = (cluster) => {
        console.log("Cluster selected", cluster);
        const filteredSchoolsForCluster = this.state.allData.filter((school, index, arr) => school.Cluster === cluster && school.Block === this.state.selectedBlock && school.District === this.state.selectedDistrict);
        var schoolNames = [...new Set(filteredSchoolsForCluster.map(school => school.SchoolName))];
        this.setState({schools: schoolNames, selectedCluster: cluster});
    }

    onSelectSchool = (selectedSchool) => {
        this.setState({selectedSchool: selectedSchool});
        this.setState({urlGrade: `${url}?school=${selectedSchool}`})
        this.setState({urlLO: `${url}?school=${selectedSchool}`})
    };

    onYearChange = (selectedYear) => {
        console.log(this.state.selectedSchool);
        if (this.state.selectedSchool !== "") {
            this.setState({selectedYear: selectedYear}, () => {
                this.onSelectSchool(this.state.selectedSchool);
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
            url = require('../assets/all_links').elementary_school;
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Elementary School Level Dashboard'}});
        } else if (typeof window !== "undefined" && window.location.href.indexOf("/sat-level/") > -1) {
            url = require('../assets/all_links').School_Level_SAT_Dashboard;
            this.setState({
                urlGrade: url,
                urlLO: url
            });
            dispatchCustomEvent({type: 'titleChange', data: {title: 'School Dashboard'}});
        } else {
            dispatchCustomEvent({type: 'titleChange', data: {title: 'Secondary School Level Dashboard'}});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value, height, width} = this.state;
        return (
            <div>
                <Header/>
                <div>
                    <Grid container spacing={0} style={{margin: 0, width: '100%'}}>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"School"}
                                data={this.state.schools}
                                onSelect={this.onSelectSchool}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"SAT Event"}
                                data={this.state.sat_events}
                                onSelect={this.onSelectDistrict}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Grade Category"}
                                data={this.state.grade_categories}
                                onSelect={this.onSelectBlock}>
                            </SimpleDropdown>
                        </Grid>
                        <Grid item xs>
                            <SimpleDropdown
                                multiple="1"
                                title={"Subject"}
                                data={this.state.subjects}
                                onSelect={this.onSelectBlock}>
                            </SimpleDropdown>
                        </Grid>
                    </Grid>
                </div>
                {/* <Tabs value={value} onChange={this.handleChange}>
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
                                        height={this.state.height - 184 - 24}
                                        id="metabaseIframeID1"
                                        className={styles.iFrameStyle}
                                        display="initial"
                                        onLoad={this.onLoadIframe}
                                        position="relative"/>}

                {value === 1 && <Iframe ref="metabaseIframeID2"
                                        url={this.state.urlLO}
                                        width="100%"
                                        height={this.state.height - 184 - 24}
                                        id="metabaseIframeID2"
                                        className={styles.iFrameStyle}
                                        display="initial"
                                        onLoad={this.onLoadIframe}
                                        position="relative"/>}
            </div>
        );
    }
}

export default withRouter(SchoolDashboard)
