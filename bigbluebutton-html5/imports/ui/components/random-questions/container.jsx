import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { withModalMounter } from '/imports/ui/components/modal/service';
import { RecordMeetings } from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import QuestionsComponent from './component';

const QuestionsContainer = props => <QuestionsComponent {...props} />;

export default withModalMounter(withTracker(({ mountModal }) => {
  const { recording, time } = RecordMeetings.findOne({ meetingId: Auth.meetingID });

  return ({
    closeModal: () => mountModal(null),

    toggleRecording: () => {
      mountModal(null);
    },

    recordingStatus: recording,
    recordingTime: time,
    isMeteorConnected: Meteor.status().connected,

  });
})(QuestionsContainer));
