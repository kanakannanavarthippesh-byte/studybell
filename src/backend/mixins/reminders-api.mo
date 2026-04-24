import ReminderLib "../lib/reminders";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/reminders";

mixin (state : ReminderLib.State) {

  /// Create a new reminder for the authenticated user
  public shared ({ caller }) func createReminder(input : Types.CreateReminderInput) : async Types.Reminder {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.create(state, caller, input, Time.now());
  };

  /// List all reminders for the authenticated user
  public shared query ({ caller }) func listReminders() : async [Types.Reminder] {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.listForUser(state, caller);
  };

  /// Get a single reminder by ID (only accessible by owner)
  public shared query ({ caller }) func getReminder(id : Types.ReminderId) : async ?Types.Reminder {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.getById(state, id, caller);
  };

  /// Update an existing reminder (only owner can update)
  public shared ({ caller }) func updateReminder(input : Types.UpdateReminderInput) : async ?Types.Reminder {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.update(state, caller, input, Time.now());
  };

  /// Delete a reminder by ID (only owner can delete)
  public shared ({ caller }) func deleteReminder(id : Types.ReminderId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.delete(state, id, caller);
  };

  /// Mark a reminder as completed
  public shared ({ caller }) func completeReminder(id : Types.ReminderId) : async ?Types.Reminder {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.markCompleted(state, id, caller, Time.now());
  };

  /// Mark a reminder as dismissed
  public shared ({ caller }) func dismissReminder(id : Types.ReminderId) : async ?Types.Reminder {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    ReminderLib.markDismissed(state, id, caller, Time.now());
  };
};
