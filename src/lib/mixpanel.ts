import mixpanel from "mixpanel-browser";

mixpanel.init("372c1b5d9565897bd8c52f8dbee60ce7", {
    record_sessions_percent: 100,
    track_pageview: true,
    ignore_dnt: true,
});

export default mixpanel;