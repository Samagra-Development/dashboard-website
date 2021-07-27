import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import GovtOfHPLogo from './../assets/govt_of_hp_logo.png'
import SamarthLogo from './../assets/samarth_logo.png'
import SSALogo from './../assets/ssa_logo.png'
import FAQs from './../assets/faq.json'


const styles = {
    header: {
        padding: 12,
    },
    typography: {
        paddingTop: "2%",
        textAlign: "center"
    },
    faq: {
        paddingRight: "5%",
        paddingLeft: "5%",
        paddingTop: "0.5%",
        textAlign: "left"
    }
};

class UserManual extends React.Component {

    constructor(props) {
        super(props);
        this.state = {width: 0, height: 0};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getSingleFAQ = this.getSingleFAQ.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    getSingleFAQ(question, answer) {
        return (
            <Grid>
                <Typography style={styles.faq} variant="h6" component="h6">
                    {question}
                </Typography>
                <Typography style={styles.faq} variant="body1" component="h6">
                    {answer}
                </Typography>
            </Grid>
        )

    }

    render() {
        const youtubeId = "SAmpVC0HZPI";
        const youtubeVideosObject = [
            {
                video: 'loGaVSOx8g0',
                title: 'For State Officials'
            },
            {
                video: 'XMWYBhcw0vw',
                title: 'For District Officials'
            },
            {
                video: 'Pd8_r-tKMkk',
                title: 'For Block Officials'
            },
            {
                video: 'iEKgE8zdvKk',
                title: 'For School Heads & Teachers'
            }
        ];
        const widthIframe = this.state.width > 1000 ? 60 : 80;
        const leftPosition = (100 - widthIframe) / 2;
        const faqPosition = widthIframe + 4;
        return (
            <Grid>
                <Typography style={styles.typography} variant="h5" component="h3">
                    How to use the SAT Dashboard
                </Typography>
                <div
                    className="video"
                    style={{
                        paddingBottom: "50px" /* 16:9 */,
                        paddingTop: 25,
                    }}>
                    {
                        youtubeVideosObject.map((videoCode) => {
                            return <div className={'video-wrapper'}>
                                <iframe
                                    style={{
                                        width: `100%`,
                                        height: '100%'
                                    }}
                                    src={`https://www.youtube.com/embed/${videoCode.video}`}
                                    frameBorder="0"
                                />
                                <div className="overlay">
                                    {videoCode.title}
                                </div>
                            </div>
                        })
                    }
                </div>
            </Grid>
        );
    }
}

UserManual.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserManual);
