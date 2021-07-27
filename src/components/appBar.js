import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {withRouter} from 'react-router-dom'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import HomeIcon from '@material-ui/icons/Home';
import Hidden from '@material-ui/core/Hidden';
import GovtOfHPLogo from './../assets/Haryana Govt logo.png';
import {trackPage, trackUser, trackEvent} from 'react-with-analytics';
import {dispatchCustomEvent} from "../utils";
import SakshamHaryanaLogo from './../assets/Saksham Haryana logo.png'
import scertLogo from './../assets/logo_scert.png'
import gohLogo from './../assets/GoH-Transparent.png'
import avsarLogo from './../assets/_Avsar.png'

const logs = [
    {name:'Logo scert',url:scertLogo},
    {name:'GoH-Transparent',url:gohLogo},
    {name:'Avsar',url:avsarLogo},
    {name:'Saksham Haryana logo',url:SakshamHaryanaLogo}
];

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    }
};

const ButtonWithRouter = withRouter(({history, ...props}) => (
    <Button
        color="inherit"
        onClick={() => {
            history.push(props.routingURL)
        }}
    >
        {props.title}
    </Button>
));

const ListItemWithRouter = withRouter(({history, ...props}) => (
    <ListItem
        button
        key={props.text}
        onClick={() => {
            history.push(props.routingURL)
        }}
    >
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText primary={props.text}/>
    </ListItem>
));

const ImageWithRouter = withRouter(({history, ...props}) => (
    <img
        className="top-bar-logo"
        src={props.image}
        alt="samarthLogo"
        onClick={() => {
            history.push(props.routingURL)
        }}
    >
    </img>
));
const LOCAL_STORAGE_VERSION = 3;

class TopAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            top: false,
            title: 'Haryana SAT Dashboard',
            left: false,
            bottom: false,
            right: false,
            routeList: ['/e-vidyalaya/state-dashboard/','/e-vidyalaya/district-dashboard/','/e-vidyalaya/block-dashboard/','/e-mentoring/','/sat-level/state-dashboard/','/sat-level/district-dashboard/','/sat-level/block-dashboard/','/sat-level/school-dashboard/'],
            routeList2: ["/", "/user-manual/"]
        };
        if (!window.localStorage.getItem('SAT-LOCAL_STORAGE_VERSION') || parseInt(window.localStorage.getItem('SAT-LOCAL_STORAGE_VERSION')) < LOCAL_STORAGE_VERSION) {
            window.localStorage.clear();
            window.localStorage.setItem('SAT-LOCAL_STORAGE_VERSION', LOCAL_STORAGE_VERSION + '');
        }
        if (!window.localStorage.getItem('SAT-metaVersion')) {
            const url = process.env.PUBLIC_URL + "/data.json";
            this.download(url);
        } else {
            console.log('here-----');
        }
    }

    toggleDrawer = (side, open) => () => {
        trackEvent('HomePage', 'Drawer', 'Click');
        this.setState({
            [side]: open,
        });
    };

    download(url) {
        fetch(url)
            .then(response => response.json())
            .then(json => {
                for (let key in json) {
                    window.localStorage.setItem('SAT-' + key, JSON.stringify(json[key]));
                }
            });
    }

    componentDidMount() {
        if (document) {
            document.addEventListener("titleChange", (event) => { // (1)
                if (event && event.detail && event.detail.title) {
                    this.setState({title: event.detail.title});
                }
            });
        }
    }


    render() {
        const {classes} = this.props;
        const dashboardIcon = (<DashboardIcon/>);
        const otherIcons = (index) => (index % 2 === 0 ? <HomeIcon/> : <AccountBoxIcon/>);

        const sideList = (
            <div className={classes.list}>
                <List>
                    {['e-Vidyalaya State Dashboard','e-Vidyalaya District Dashboard','e-Vidyalaya Block Dashboard','e-Mentoring Dashboard','State Level SAT Dashboard','District Level SAT Dashboard','Block Level SAT Dashboard','School Level SAT Dashboard'].map((text, index) => (
                        <ListItemWithRouter text={text} icon={dashboardIcon} routingURL={this.state.routeList[index]}/>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['Home'].map((text, index) => (
                        <ListItemWithRouter text={text} icon={otherIcons(index)}
                                            routingURL={this.state.routeList2[index]}/>
                    ))}
                </List>
            </div>
        );
        const {title} = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            onClick={this.toggleDrawer('left', true)}
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={this.toggleDrawer('left', false)}
                                onKeyDown={this.toggleDrawer('left', false)}
                            >
                                {sideList}
                            </div>
                        </Drawer>
                        {/* <ImageWithRouter image={GovtOfHPLogo} routingURL={'/'}/> */}
                        {logs.map((e,index) => 
                            <ImageWithRouter routingURL={'/'} key={index} image={e.url} alt={e.name}/>
                        )}
                        <Typography variant="h6" color="inherit" className={classes.grow + ' header-title'}>
                            {title}
                        </Typography>
                        <Hidden smDown>
                            <ButtonWithRouter title={"Home"} routingURL={'/'}></ButtonWithRouter>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

TopAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopAppBar);
