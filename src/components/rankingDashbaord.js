import React, { Component } from 'react';
import SimpleDropdown from './simpleDropdown'
import Iframe from 'react-iframe'
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
    iFrameStyle: {
      pointerEvents: 'none'
    },
}

// const baseURL = 'http://134.209.177.56:3000'
const baseURL = 'https://sad-metabase.samagra.io'

export default class RankingDashboard extends Component {

    state = {
        url: `${baseURL}/public/dashboard/87b7c875-d894-4428-853c-ae84fddfe09b`,
        value: 0,
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onLoadIframe = this.onLoadIframe.bind(this);
    }

    onLoadIframe () {
        console.log("Iframe loaded");
    }
    
    handleChange = (event, value) => {
        this.setState({ value });
    };

    render(){
        return (
            <div>
                <Iframe ref="metabaseIframeID1"
                    url= {this.state.url}
                    width="100%"
                    height="800px"
                    id="metabaseIframeID1"
                    className={styles.iFrameStyle}
                    display="initial"
                    onLoad={this.onLoadIframe}
                    position="relative"/>
            </div>
        );
    }
}