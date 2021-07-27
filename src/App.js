import "./App.css";

import {BrowserRouter, Route, Switch, withRouter} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import withAnalytics, {initAnalytics} from "react-with-analytics";

import BlockDashboard from "./components/blockDashboard";
import DistrictDashboard from "./components/districtDashboard";
import HomePage from "./components/homePage";
import {PropTypes} from "prop-types";
import RankingDashboard from "./components/rankingDashbaord";
import React from "react";
import ReactGA from "react-ga";
import ReactPiwik from "react-piwik";
import SchoolDashboard from "./components/schoolDashboard";
import StateDashboard from "./components/stateDashboard";
import ESupportiveStateDistrictDashboard from "./components/eSupportiveStateDistrictDashboard";
import ESupportiveBlockDashboard from "./components/eSupportiveBlockDashboard";
import SupportiveStateDistrictDashboard from "./components/supportiveStateDistrictDashboard";
import SupportiveBlockDashboard from "./components/supportiveBlockDashboard";
import TopAppBar from "./components/appBar";
import UserManual from "./components/userManual";
import DownloadReportDashboard from "./components/downloadDashboard";
import MonthlyComplianceDashboard from "./components/monthlyComplianceDashboard";
import PrimaryDashboard from "./components/primaryDashboard";
import UpperPrimaryDashboard from "./components/upperPrimaryDashboard";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#f7caac",
            contrastText: "#1f3864"
        },
        secondary: {
            main: "#f7caac",
            contrastText: "#000"
        },
        type: "light"
        // text: {
        //   primary: "#fff",
        // }
        // error: will use the default color
    }
});

const siteId = process.env.NODE_ENV === "production" ? 3 : 2;

const piwik = new ReactPiwik({
    url: "www.analytics.cttsamagra.xyz/piwik/",
    siteId: siteId,
    trackErrors: true
});

// Set tracking ID
const GA_TRACKING_ID =
    process.env.NODE_ENV === "production" ? "UA-157866469-2" : "UA-157866469-2";
const debug = process.env.NODE_ENV === "production" ? false : true;
// initAnalytics("UA-157866469", {debug: debug});

ReactGA.initialize('UA-157866469-2', {
  debug: true,
  titleCase: false,
  gaOptions: {
    siteSpeedSampleRate: 100
  }
});

class GAListener extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    };

    componentDidMount() {
        this.sendPageView(this.context.router.history.location);
        this.context.router.history.listen(this.sendPageView);
    }

    sendPageView(location) {
        ReactGA.set({page: location.pathname});
        ReactGA.pageview(location.pathname);
    }

    render() {
        return this.props.children;
    }
}

const Root = () => (
    <Switch>
        <Route exact path="/" component={HomePage}/>
        {/* <Route exact path="/monthly-compliance/" component={() => <MonthlyComplianceDashboard key={'1'}/>}/>
        <Route exact path="/monthly-insights-primary/" component={() => <PrimaryDashboard key={'3'}/>}/>
        <Route exact path="/monthly-insights-upper-primary/" component={() => <UpperPrimaryDashboard key={'3'}/>}/>
        <Route exact path="/district-dashboard/" component={() => <DistrictDashboard key={'4'}/>}/>
        <Route exact path="/state-dashboard/" component={() => <StateDashboard key={'5'}/>}/>
        <Route exact path="/elementary/school-dashboard/" component={() => <SchoolDashboard key={'2'}/>}/>
        <Route exact path="/elementary/block-dashboard/" component={() => <BlockDashboard key={'6'}/>}/>
        <Route exact path="/elementary/district-dashboard/" component={() => <DistrictDashboard key={'7'}/>}/>
        <Route exact path="/elementary/state-dashboard/" component={() => <StateDashboard key={'8'}/>}/> */}
        <Route exact path="/e-supportive/state-district-dashboard/" component={() => <ESupportiveStateDistrictDashboard />}/>
        <Route exact path="/e-supportive/block-dashboard/" component={() => <ESupportiveBlockDashboard />}/>
        <Route exact path="/supportive/state-district-dashboard/" component={() => <SupportiveStateDistrictDashboard />}/>
        <Route exact path="/supportive/block-dashboard/" component={() => <SupportiveBlockDashboard />}/>
    </Switch>
);

const AppWithRouter = withRouter(withAnalytics(Root));

function App() {
    return (
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <div className="App">
                    <TopAppBar/>
                    <AppWithRouter/>
                </div>
            </MuiThemeProvider>

        </BrowserRouter>
    );
}

export default App;
