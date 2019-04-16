import { connect } from "react-redux";

import MainView from "./MainView";

import * as appActions from "@redux/modules/app/actions";

const mapStateToProps = state => ({
    appState: state.app,
});

const mapDispatchToProps = {
    reset_settings: appActions.reset_settings,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MainView);
