import Common "common";

module {
  public type ReminderId = Common.ReminderId;
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  /// Status of a reminder
  public type ReminderStatus = {
    #pending;
    #completed;
    #dismissed;
  };

  /// Internal mutable reminder record
  public type ReminderInternal = {
    id : ReminderId;
    owner : UserId;
    var title : Text;
    var subject : Text;
    var scheduledAt : Timestamp; // Unix timestamp in nanoseconds
    var notes : ?Text;
    var status : ReminderStatus;
    createdAt : Timestamp;
    var updatedAt : Timestamp;
  };

  /// Immutable shared reminder (API boundary type)
  public type Reminder = {
    id : ReminderId;
    owner : UserId;
    title : Text;
    subject : Text;
    scheduledAt : Timestamp;
    notes : ?Text;
    status : ReminderStatus;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// Input type for creating a new reminder
  public type CreateReminderInput = {
    title : Text;
    subject : Text;
    scheduledAt : Timestamp;
    notes : ?Text;
  };

  /// Input type for updating an existing reminder
  public type UpdateReminderInput = {
    id : ReminderId;
    title : Text;
    subject : Text;
    scheduledAt : Timestamp;
    notes : ?Text;
  };
};
