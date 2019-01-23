import React, { Component } from 'react';
import Radium from 'radium';
import { CSS, DragDropCss as styles } from '../../assets/styles/index';
import { connect } from "react-redux";
import { uploadFilesFromUrls, uploadFiles, modalClose } from '../../actions/index';
import { isEnterClick } from '../../utils/index';
import { SearchGroup, InputSearch, ButtonSearch, SearchWrapper } from '../../styledComponents/index';
import { Spinner } from '../Spinner';
import { I18n } from 'react-i18nify';


const STEP = {
  DEFAULT: 'DEFAULT',
  UPLOADING: 'UPLOADING',
  ERROR: 'ERROR',
  UPLOADED: 'UPLOADED',
};

class UserUploaderTab extends Component {
  state = {
    step: STEP.DEFAULT,
    errorMsg: '',
    isDragOver: false,
    files: [],
    uploadedFiles: []
  };

  isFilesValid = files => true;

  fileDropHandler = event => {
    event.preventDefault();
    this.changeFile((event.dataTransfer || event.originalEvent.dataTransfer).files);
  };

  fileChangeHandler = ({ target }) => {
    this.changeFile(target.files);
  };

  changeFile = (files = []) => {
    this.setState({ files });

    setTimeout(() => {
      if (files && this.isFilesValid(files)) this.upload();
    });
  };

  changeStep = step => this.setState({ step });
  uploadStart = () => this.setState({ step: STEP.UPLOADING });
  uploadSuccess = uploadedFiles => this.setState({ step: STEP.UPLOADED, uploadedFiles });
  uploadError = (msg, timer = null) => {
    this.setState({ step: STEP.ERROR, errorMsg: msg || I18n.t('upload.error') });
    if (timer) setTimeout(() => this.changeStep(STEP.DEFAULT), timer);
  };

  upload = (isUploadFromUrl = false, url = null) => {
    // if (this.state.isLoading) return;
    const self = this.props;

    this.uploadStart();
    (
      isUploadFromUrl
        ? this.props.onFileUploadFromUrl(url, this.props.uploaderConfig)
        : this.props.onFilesUpload(this.state.files, this.props.uploaderConfig)
    )
      .then((files) => {
        this.uploadSuccess(files);

        if (this.props.uploaderConfig.tagging.active) {
          this.props.saveUploadedFiles(files);
          this.props.setPostUpload(true, 'TAGGING', 'UPLOAD');
          return;
        }

        self.uploaderConfig.uploadHandler(files);

        if (this.props.onClose) this.props.onClose();

        self.modalClose();
      })
      .catch((error) => {
        this.uploadError(error.msg)
      })
  };

  uploadFromWeb = () => {
    const value = this._uploadFromWebField.value;
    const isValid = value && /^(http:\/\/|https:\/\/|\/\/)/.test(value);

    if (isValid) this.upload(true, value);
    else this.uploadError(value ? I18n.t('upload.url_not_valid') : I18n.t('upload.empty_url'), 4000);
  };

  render() {
    const { step, uploadedFiles = [], errorMsg = '' } = this.state;
    const uploadBlock_style = styles.container.uploadBlock;

    return (
      <div style={[styles.container]}>
        {
          step !== STEP.UPLOADED &&
          <div
            onDragOver={e => {
              e.preventDefault();
              this.setState({ isDragOver: true })
            }}
            onDragEnter={e => {
              e.preventDefault();
              this.setState({ isDragOver: true })
            }}
            onDragLeave={e => {
              e.preventDefault();
              this.setState({ isDragOver: false })
            }}
            onDragEnd={e => {
              e.preventDefault();
              this.setState({ isDragOver: false })
            }}
            onDrop={this.fileDropHandler}
            style={[uploadBlock_style, this.state.isDragOver && { background: "rgba(210, 253, 207, 0.5)" }]}
            method={'post'}
            encType="multipart/form-data"
          >

            {
              (step === STEP.DEFAULT || step === STEP.ERROR) &&
              <div style={[uploadBlock_style.inputBox]}>
                <input
                  style={[uploadBlock_style.inputBox.file]}
                  type="file"
                  name="files[]"
                  ref="fileInput"
                  data-multiple-caption="{count} files selected"
                  defaultValue={''}
                  tabIndex={-1}
                  multiple={true}
                  onChange={this.fileChangeHandler}
                />

                <div style={[uploadBlock_style.inputBox.label]}>
                  <span style={[uploadBlock_style.inputBox.label.dragDropText]}>
                     {I18n.t('upload.drag_file_here')}
                  </span>
                  <div style={[uploadBlock_style.inputBox.label.orText]}>{I18n.t('upload.or')}</div>
                  <button
                    key="browse-your-computer"
                    autoFocus={true}
                    style={[CSS.button, { margin: 'auto', fontWeight: 400, textTransform: 'none' }]}
                    onClick={() => { this.refs.fileInput.click() }}
                  >{I18n.t('upload.browse_your_computer')}
                  </button>
                  <div style={[uploadBlock_style.inputBox.label.orText, { paddingBottom: 0 }]}>
                    {I18n.t('upload.or')}
                  </div>
                  <SearchWrapper>
                    <SearchGroup>
                      <InputSearch
                        type="search"
                        innerRef={node => this._uploadFromWebField = node}
                        autoFocus={true}
                        defaultValue={''}
                        placeholder={I18n.t('upload.enter_url_to_upload_from_web')}
                        onKeyDown={ev => isEnterClick(ev) && this.uploadFromWeb()}
                      />
                      <ButtonSearch
                        key="ok"
                        className="ae-btn"
                        onClick={this.uploadFromWeb}
                      >{I18n.t('upload.upload_btn')}</ButtonSearch>
                    </SearchGroup>
                  </SearchWrapper>
                  <div style={[{
                    fontSize: "12px",
                    color: '#5D636B',
                    fontWeight: "200",
                    marginTop: "5px"
                  }]}>
                    {I18n.t('upload.accepted_file_types')}
                  </div>
                </div>

                <div ref="submitBtn" className="ae-btn" style={[uploadBlock_style.inputBox.submitBtn]} type="submit">
                  {I18n.t('upload.upload_btn')}
                </div>
              </div>
            }

            {step === STEP.UPLOADING &&
            <div style={[uploadBlock_style.uploadingBox]}>
              <Spinner overlay show={true}/>
              <span>{I18n.t('upload.uploading')}</span>
            </div>}

            {step === STEP.ERROR &&
            <div style={[uploadBlock_style.errorBox]}>
              <span style={[uploadBlock_style.errorBox.errorMsg]} role="alert">{errorMsg}</span>
            </div>}
          </div>
        }
      </div>
    );
  }
}

export default connect(
  ({ uploader: { uploaderConfig } }) => ({ uploaderConfig }),
  {
    onFilesUpload: uploadFiles,
    onFileUploadFromUrl: uploadFilesFromUrls,
    modalClose
  }
)(Radium(UserUploaderTab));