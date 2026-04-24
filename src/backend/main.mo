import ReminderLib "lib/reminders";
import RemindersMixin "mixins/reminders-api";

actor {
  let reminderState = ReminderLib.newState();

  include RemindersMixin(reminderState);
};
