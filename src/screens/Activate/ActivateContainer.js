import { connect } from "react-redux";

import ActivateView from "./ActivateView";

import * as appActions from "@redux/modules/app/actions";

const mapStateToProps = state => ({
    appState: state.app,
});

const mapDispatchToProps = {
    get_settings: appActions.get_settings,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ActivateView);
