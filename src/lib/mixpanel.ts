import mixpanel from "mixpanel-browser";

mixpanel.init("2bb8d08521ad815b6a3d0f015a12bfa2", {
    record_sessions_percent: 100,
    track_pageview: true,
    ignore_dnt: true,
});

export default mixpanel;