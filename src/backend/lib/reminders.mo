import List "mo:core/List";
import Principal "mo:core/Principal";
import Types "../types/reminders";

module {
  public type State = {
    reminders : List.List<Types.ReminderInternal>;
    var nextId : Nat;
  };

  /// Create a new empty state
  public func newState() : State {
    {
      reminders = List.empty<Types.ReminderInternal>();
      var nextId = 0;
    };
  };

  /// Convert internal mutable reminder to immutable shared type
  public func toShared(r : Types.ReminderInternal) : Types.Reminder {
    {
      id = r.id;
      owner = r.owner;
      title = r.title;
      subject = r.subject;
      scheduledAt = r.scheduledAt;
      notes = r.notes;
      status = r.status;
      createdAt = r.createdAt;
      updatedAt = r.updatedAt;
    };
  };

  /// Create a reminder and add it to state, returns the new reminder
  public func create(
    state : State,
    owner : Types.UserId,
    input : Types.CreateReminderInput,
    now : Types.Timestamp,
  ) : Types.Reminder {
    let id = state.nextId;
    state.nextId += 1;
    let reminder : Types.ReminderInternal = {
      id;
      owner;
      var title = input.title;
      var subject = input.subject;
      var scheduledAt = input.scheduledAt;
      var notes = input.notes;
      var status = #pending;
      createdAt = now;
      var updatedAt = now;
    };
    state.reminders.add(reminder);
    toShared(reminder);
  };

  /// Get all reminders for a specific user
  public func listForUser(state : State, owner : Types.UserId) : [Types.Reminder] {
    state.reminders
      .filter(func(r) { Principal.equal(r.owner, owner) })
      .map<Types.ReminderInternal, Types.Reminder>(func(r) { toShared(r) })
      .toArray();
  };

  /// Get a single reminder by ID (returns null if not found or not owned by caller)
  public func getById(state : State, id : Types.ReminderId, owner : Types.UserId) : ?Types.Reminder {
    switch (state.reminders.find(func(r) { r.id == id and Principal.equal(r.owner, owner) })) {
      case (?r) { ?toShared(r) };
      case null { null };
    };
  };

  /// Update an existing reminder, returns updated reminder or null if not found/unauthorized
  public func update(
    state : State,
    owner : Types.UserId,
    input : Types.UpdateReminderInput,
    now : Types.Timestamp,
  ) : ?Types.Reminder {
    switch (state.reminders.find(func(r) { r.id == input.id and Principal.equal(r.owner, owner) })) {
      case (?r) {
        r.title := input.title;
        r.subject := input.subject;
        r.scheduledAt := input.scheduledAt;
        r.notes := input.notes;
        r.updatedAt := now;
        ?toShared(r);
      };
      case null { null };
    };
  };

  /// Delete a reminder by ID, returns true if deleted, false if not found/unauthorized
  public func delete(state : State, id : Types.ReminderId, owner : Types.UserId) : Bool {
    let before = state.reminders.size();
    let kept = state.reminders.filter(func(r) {
      not (r.id == id and Principal.equal(r.owner, owner))
    });
    let after = kept.size();
    if (after < before) {
      state.reminders.clear();
      state.reminders.append(kept);
      true;
    } else {
      false;
    };
  };

  /// Mark a reminder as completed, returns updated reminder or null if not found/unauthorized
  public func markCompleted(state : State, id : Types.ReminderId, owner : Types.UserId, now : Types.Timestamp) : ?Types.Reminder {
    setStatus(state, id, owner, #completed, now);
  };

  /// Mark a reminder as dismissed, returns updated reminder or null if not found/unauthorized
  public func markDismissed(state : State, id : Types.ReminderId, owner : Types.UserId, now : Types.Timestamp) : ?Types.Reminder {
    setStatus(state, id, owner, #dismissed, now);
  };

  /// Internal helper to set status
  private func setStatus(
    state : State,
    id : Types.ReminderId,
    owner : Types.UserId,
    status : Types.ReminderStatus,
    now : Types.Timestamp,
  ) : ?Types.Reminder {
    switch (state.reminders.find(func(r) { r.id == id and Principal.equal(r.owner, owner) })) {
      case (?r) {
        r.status := status;
        r.updatedAt := now;
        ?toShared(r);
      };
      case null { null };
    };
  };
};
