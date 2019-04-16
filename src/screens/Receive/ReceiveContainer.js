import { connect } from "react-redux";

import ReceiveView from "./ReceiveView";

const mapStateToProps = state => ({
    appState: state.app,
});

const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ReceiveView);
