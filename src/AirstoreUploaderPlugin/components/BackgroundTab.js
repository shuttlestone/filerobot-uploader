import React, { Component } from 'react';
import Radium from 'radium';
import {CSS, BgCss as styles} from '../assets/styles';
import {getBackgrounds, uploadFilesFromUrls} from '../actions';
import { connect } from 'react-redux';

class BackgroundTab extends Component {
  state = { isLoading: false, uploadingUuid: null };

  uploadStart = uuid => this.setState({ uploadingUuid: uuid, isLoading: true });

  uploadStop = () => this.setState({ uploadingUuid: null, isLoading: false });

  upload = (bg = {}) => {
    if (this.state.isLoading) return;

    this.uploadStart(bg.uuid);
    this.props.onFileUpload(bg.url_public, this.props.uploaderConfig)
      .then(() => this.uploadStop(), () => this.uploadStop());
  };

  componentDidMount() {
    this.props.onGetBackgrounds();
  }

  render() {
    const { isLoading, uploadingUuid } = this.state;
    const itemStyles = styles.container.item;

    return <div style={[styles.container]}>
      {this.props.backgrounds.map(bg =>
        <div
          style={[
            itemStyles,
            isLoading && uploadingUuid === bg.uuid && itemStyles.loading.active,
            isLoading && uploadingUuid !== bg.uuid && itemStyles.loading.notActive
          ]}
          key={`bg-${bg.uuid}`}
          onClick={this.upload.bind(this, bg)}
        >
          <span style={[styles.container.item.alignmentBlock]}/>
          <img style={[styles.container.item.img]} src={bg.url_preview} width="100%" height="auto" />
        </div>
      )}
    </div>
  }
}

export default connect(
  ({uploader: {backgrounds, uploaderConfig}}) => ({backgrounds, uploaderConfig}),
  dispatch => ({
    onFileUpload: (file, uploaderConfig) => dispatch(uploadFilesFromUrls([file], uploaderConfig)),
    onGetBackgrounds: () => dispatch(getBackgrounds())
  })
)(Radium(BackgroundTab));