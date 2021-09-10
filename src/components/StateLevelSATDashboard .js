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
let url = "";

export default class StateLevelSATDashboard extends Component {
    state = {
        url: `${url}`,
        value: 0,
        width: 0,
        height: 0
    };

    constructor(props) {
        super(props);
        this.onLoadIframe = this.onLoadIframe.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    onLoadIframe() {
        console.log("Iframe loaded");
    }

    componentDidMount() {
        getIP().then((ip) => this.setState({ip}));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        url = require('../assets/all_links').SAT_elementary_state;
        this.setState({urlGrade: url});
        dispatchCustomEvent({type: 'titleChange', data: {title: 'SAT State Dashboard'}});
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        const {value, urlGrade} = this.state;
        console.log(urlGrade);
        return (
            <div>
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
