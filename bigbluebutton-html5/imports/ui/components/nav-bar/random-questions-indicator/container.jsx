import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { RecordMeetings } from '/imports/api/meetings';
import Auth from '/imports/ui/services/auth';
import RandonQuestionsIndicator from './component';

const RandonQuestionsIndicatorContainer = props => (
  <RandonQuestionsIndicator {...props} />
);

export default withTracker(() => {
  const meetingId = Auth.meetingID;
  const recordObeject = RecordMeetings.findOne({ meetingId });

  return {
    allowStartStopRecording: !!(recordObeject && recordObeject.allowStartStopRecording),
  };
})(RandonQuestionsIndicatorContainer);
