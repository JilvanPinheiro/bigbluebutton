import React, { PureComponent, Fragment } from 'react';
import QuestionsContainer from '/imports/ui/components/random-questions/container';
import Tooltip from '/imports/ui/components/tooltip/component';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { styles } from './styles';

const propTypes = {
  amIModerator: PropTypes.bool,
  allowStartStopRecording: PropTypes.bool,
  mountModal: PropTypes.func.isRequired,
};

const defaultProps = {
  amIModerator: false,
};

class RandonQuestionsIndicator extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      mountModal,
      amIModerator,
      allowStartStopRecording,
    } = this.props;

    const recordingToggle = () => {
      mountModal(<QuestionsContainer amIModerator={amIModerator} />);
      document.activeElement.blur();
    };

    const questionIndicatorIcon = (
      <span className={styles.recordingIndicatorIcon}>
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="dice" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="svg-inline--fa fa-dice fa-w-20 fa-5x"><path fill="currentColor" d="M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z" className="" /></svg>
      </span>
    );

    const showButton = amIModerator && allowStartStopRecording;

    const recordMeetingButton = (
      <div
        aria-label="Gerar Perguntas"
        className={styles.recordingControlOFF}
        role="button"
        tabIndex={0}
        key="recording-toggle"
        onClick={recordingToggle}
        onKeyPress={recordingToggle}
      >
        {questionIndicatorIcon}

        <div className={styles.presentationTitle}>
          <span>Gerar Perguntas</span>
        </div>
      </div>
    );

    const recordMeetingButtonWithTooltip = (
      <Tooltip title="Gerar Perguntas Aleatórias">
        {recordMeetingButton}
      </Tooltip>
    );

    return (
      <Fragment>
        <span className={styles.presentationTitleSeparator} aria-hidden>|</span>
        <div className={styles.recordingIndicator}>
          {showButton
            ? recordMeetingButtonWithTooltip
            : null}
        </div>
      </Fragment>
    );
  }
}

RandonQuestionsIndicator.propTypes = propTypes;
RandonQuestionsIndicator.defaultProps = defaultProps;

export default injectIntl(RandonQuestionsIndicator);
