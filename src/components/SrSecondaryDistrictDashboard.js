import React, {Component} from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Header from "./header";
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

let url = "";
export default class SrSecondaryDistrictDashboard extends Component {

    state = {
        allData: [],
        districts: [],
        selectedDistrict: "",
        value: 0,
        width: 0,
        height: 0,
        ip: "",
        loading: true
    };

    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onSelectDistrict = this.onSelectDistrict.bind(this);
        this.download();
    }

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    download() {
        const urls = [
            {name:'districts',url:'https://saksham.monitoring.dashboard.samagra.io/api/public/dashboard/c446828a-1298-41c2-bd85-8e78b2c68509/params/6466d8d2/values'},
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

    onSelectDistrict = (selectedDistrict) => {
        this.setState({selectedDistrict: selectedDistrict});
    };

    setLink = () => {
        var customUrl = "";
        if(this.state.selectedDistrict.length > 0) {
            this.state.selectedDistrict.map((e,index) => {
                if(!index) {
                    customUrl += 'district='+e;
                } else {
                    customUrl += '&district='+e;
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
        url = require('../assets/all_links').SAT_sr_secondary_district;
        this.setState({urlGrade: url});
        dispatchCustomEvent({type: 'titleChange', data: {title: 'SAT District Dashboard - Sr.Secondary'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedDistrict !== this.state.selectedDistrict) {
            this.setLink();
        }
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value} = this.state;
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
                                title={"District"}
                                data={this.state.districts}
                                onSelect={this.onSelectDistrict}>
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
            </div>
        );
    }
}
