import React, { Component } from 'react';
import { Link } from 'react-router';
import Button from '/imports/ui/components/button/component';
import Icon from '/imports/ui/components/icon/component';
import { findDOMNode } from 'react-dom';
import { defineMessages, injectIntl } from 'react-intl';
import _ from 'lodash';
import { styles } from './styles.scss';

const intlMessages = defineMessages({
  pollPaneTitle: {
    id: 'app.poll.pollPaneTitle',
    description: 'heading label for the poll menu',
  },
  hidePollDesc: {
    id: 'app.poll.hidePollDesc',
    description: 'aria label description for hide poll button',
  },
  customPollLabel: {
    id: 'app.poll.customPollLabel',
    description: 'label for custom poll button',
  },
  startCustomLabel: {
    id: 'app.poll.startCustomLabel',
    description: 'label for button to start custom poll',
  },
  customPollInstruction: {
    id: 'app.poll.customPollInstruction',
    description: 'instructions for using custom poll',
  },
  quickPollInstruction: {
    id: 'app.poll.quickPollInstruction',
    description: 'instructions for using pre configured polls',
  },
  activePollInstruction: {
    id: 'app.poll.activePollInstruction',
    description: 'instructions displayed when a poll is active',
  },
  publishLabel: {
    id: 'app.poll.publishLabel',
    description: 'label for the publish button',
  },
  backLabel: {
    id: 'app.poll.backLabel',
    description: 'label for the return to poll options button',
  },
  customPlaceholder: {
    id: 'app.poll.customPlaceholder',
    description: 'custom poll input field placeholder text',
  },
  tf: {
    id: 'app.poll.tf',
    description: 'label for true / false poll',
  },
  yn: {
    id: 'app.poll.yn',
    description: 'label for Yes / No poll',
  },
  a2: {
    id: 'app.poll.a2',
    description: 'label for A / B poll',
  },
  a3: {
    id: 'app.poll.a3',
    description: 'label for A / B / C poll',
  },
  a4: {
    id: 'app.poll.a4',
    description: 'label for A / B / C / D poll',
  },
  a5: {
    id: 'app.poll.a5',
    description: 'label for A / B / C / D / E poll',
  },
});

const MAX_CUSTOM_FIELDS = Meteor.settings.public.poll.max_custom;

class Poll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customPollReq: false,
      isPolling: false,
    };

    this.pollOptions = [];

    this.toggleCustomFields = this.toggleCustomFields.bind(this);
    this.renderQuickPollBtns = this.renderQuickPollBtns.bind(this);
    this.renderInputFields = this.renderInputFields.bind(this);
    this.validateInputField = this.validateInputField.bind(this);
    this.nonPresenterRedirect = this.nonPresenterRedirect.bind(this);
    this.getInputFields = this.getInputFields.bind(this);
  }

  componentWillMount() {
    this.nonPresenterRedirect();
  }

  componentDidUpdate(prevProps, prevState) {
    this.nonPresenterRedirect();
  }

  nonPresenterRedirect() {
    const { currentUser, router } = this.props;
    if (!currentUser.presenter) return router.push('/users');
  }

  getInputFields() {
    const { intl } = this.props;
    const items = [];

    items = _.range(1, MAX_CUSTOM_FIELDS + 1).map((ele, index) => (
      <input
        key={_.uniqueId('custom-poll-')}
        placeholder={intl.formatMessage(intlMessages.customPlaceholder)}
        className={styles.input}
        ref={(node) => { this[`pollInput${index}`] = node; }}
        onChange={() => this.validateInputField(this[`pollInput${index}`])}
        data-index={index}
      />
    ));

    return items;
  }

  validateInputField(ref) {
    // This regex will replace any instance of 2 or more consecutive white spaces
    // with a single white space character.
    const option = ref.value.replace(/\s{2,}/g, ' ').trim();
    const index = ref.getAttribute('data-index');

    this.pollOptions[index] = option === '' ? '' : option;

    return _.compact(this.pollOptions).length > 1
      ? findDOMNode(this.startPollBtn).setAttribute('aria-disabled', 'false')
      : findDOMNode(this.startPollBtn).setAttribute('aria-disabled', 'true');
  }

  toggleCustomFields() {
    const { customPollReq } = this.state;

    this.pollOptions = [];

    return customPollReq
      ? this.setState({ customPollReq: false })
      : this.setState({ customPollReq: true });
  }

  renderQuickPollBtns() {
    const { pollTypes, startPoll, intl } = this.props;

    const btns = pollTypes.map((type) => {
      if (type === 'custom') return;

      const label = intl.formatMessage(
        // regex removes the - to match the message id
        intlMessages[type.replace(/-/g, '').toLowerCase()]);

      return (
        <Button
          label={label}
          color="default"
          className={styles.pollBtn}
          key={_.uniqueId('quick-poll-')}
          onClick={() => {
          this.setState({ isPolling: true }, () => startPoll(type));
        }}
        />);
    });

    return btns;
  }

  renderInputFields() {
    const { intl, startCustomPoll } = this.props;

    return (
      <div className={styles.customInputWrapper}>
        {this.getInputFields()}
        <Button
          onClick={() => {
            if (_.compact(this.pollOptions).length > 1) {
              this.setState({ isPolling: true }, () => startCustomPoll('custom', _.compact(this.pollOptions)));
            }
          }}
          label={intl.formatMessage(intlMessages.startCustomLabel)}
          color="primary"
          ref={node => this.startPollBtn = node}
          aria-disabled
          className={styles.btn}
        />
      </div>
    );
  }

  renderActivePollOptions() {
    const {
      intl, router, publishPoll, stopPoll,
    } = this.props;

    return (
      <div>
        <div className={styles.instructions}>{intl.formatMessage(intlMessages.activePollInstruction)}</div>
        <Button
          onClick={() => {
            publishPoll();
            router.push('/users');
          }}
          label={intl.formatMessage(intlMessages.publishLabel)}
          color="primary"
          className={styles.btn}
        />
        <Button
          onClick={() => {
            stopPoll();
            this.pollOptions = [];
            this.setState({ isPolling: false });
          }}
          label={intl.formatMessage(intlMessages.backLabel)}
          color="default"
          className={styles.btn}
        />
      </div>
    );
  }

  renderPollOptions() {
    const { intl } = this.props;
    const { customPollReq } = this.state;

    return (
      <div>
        <div className={styles.instructions}>
          {intl.formatMessage(intlMessages.quickPollInstruction)}
        </div>
        <div className={styles.grid}>
          {this.renderQuickPollBtns()}
        </div>
        <div className={styles.instructions}>
          {intl.formatMessage(intlMessages.customPollInstruction)}
        </div>
        <Button
          className={styles.customBtn}
          color="default"
          onClick={this.toggleCustomFields}
          label={intl.formatMessage(intlMessages.customPollLabel)}
        />
        {!customPollReq ? null : this.renderInputFields()}
      </div>
    );
  }

  render() {
    const {
      intl, stopPoll,
    } = this.props;

    return (
      <div>
        <header className={styles.header}>
          <Link
            to="/users"
            role="button"
            aria-label={intl.formatMessage(intlMessages.hidePollDesc)}
            onClick={() => {
              if (this.state.isPolling) {
                stopPoll();
                this.setState({ isPolling: false });
              }
            }}
          >
            <Icon iconName="left_arrow" />{intl.formatMessage(intlMessages.pollPaneTitle)}
          </Link>
        </header>
        {
          this.state.isPolling ? this.renderActivePollOptions() : this.renderPollOptions()
        }
      </div>
    );
  }
}

export default injectIntl(Poll);
