import { it, describe, afterEach, assert } from "vitest";
import {
  executeGraphqlOperationAsUser,
  insertEvent,
  insertTicket,
  insertTicketTemplate,
  insertUser,
  insertUserToEvent,
} from "~/tests/__fixtures";
import { clearDatabase } from "~/tests/__fixtures/databaseHelper";
import {
  ApprovalUserTicket,
  ApprovalUserTicketMutation,
  ApprovalUserTicketMutationVariables,
} from "./approvalUserTicket.generated";

afterEach(() => {
  clearDatabase();
});

describe("Approval user ticket test", () => {
  it("Should approve a user ticket if is superadmin", async () => {
    const event1 = await insertEvent();
    const user1 = await insertUser({
      isSuperAdmin: true,
    });
    await insertUserToEvent({
      eventId: event1.id,
      userId: user1.id,
      role: "member",
    });
    const ticketTemplate1 = await insertTicketTemplate({
      eventId: event1.id,
      requiresApproval: true,
    });
    const ticket1 = await insertTicket({
      ticketTemplateId: ticketTemplate1.id,
      userId: user1.id,
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: ticket1.id,
        },
      },
      user1,
    );

    assert.equal(response.errors, undefined);
    assert.equal(response.data?.approvalUserTicket?.approvalStatus, "approved");
  });
  it("Should approve a user ticket if is event admin", async () => {
    const event1 = await insertEvent();
    const user1 = await insertUser();
    await insertUserToEvent({
      eventId: event1.id,
      userId: user1.id,
      role: "admin",
    });
    const ticketTemplate1 = await insertTicketTemplate({
      eventId: event1.id,
      requiresApproval: true,
    });
    const ticket1 = await insertTicket({
      ticketTemplateId: ticketTemplate1.id,
      userId: user1.id,
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: ticket1.id,
        },
      },
      user1,
    );

    assert.equal(response.errors, undefined);
    assert.equal(response.data?.approvalUserTicket?.approvalStatus, "approved");
  });
  it("It should throw an error if the user is not an event admin or superadmin", async () => {
    const event1 = await insertEvent();
    const user1 = await insertUser();
    await insertUserToEvent({
      eventId: event1.id,
      userId: user1.id,
      role: "member",
    });
    const ticketTemplate1 = await insertTicketTemplate({
      eventId: event1.id,
      requiresApproval: true,
    });
    const ticket1 = await insertTicket({
      ticketTemplateId: ticketTemplate1.id,
      userId: user1.id,
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: ticket1.id,
        },
      },
      user1,
    );

    assert.equal(response.errors?.[0].message, "Unauthorized!");
  });
  it("It should throw an error if the ticket is already approved", async () => {
    const event1 = await insertEvent();
    const user1 = await insertUser({
      isSuperAdmin: true,
    });
    await insertUserToEvent({
      eventId: event1.id,
      userId: user1.id,
      role: "member",
    });
    const ticketTemplate1 = await insertTicketTemplate({
      eventId: event1.id,
      requiresApproval: true,
    });
    const ticket1 = await insertTicket({
      ticketTemplateId: ticketTemplate1.id,
      userId: user1.id,
      approvalStatus: "approved",
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: ticket1.id,
        },
      },
      user1,
    );

    assert.equal(response.errors?.[0].message, "Ticket already approved");
  });
  it("It should throw an error if the ticket does not require approval", async () => {
    const event1 = await insertEvent();
    const user1 = await insertUser({
      isSuperAdmin: true,
    });
    await insertUserToEvent({
      eventId: event1.id,
      userId: user1.id,
      role: "member",
    });
    const ticketTemplate1 = await insertTicketTemplate({
      eventId: event1.id,
      requiresApproval: false,
    });
    const ticket1 = await insertTicket({
      ticketTemplateId: ticketTemplate1.id,
      userId: user1.id,
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: ticket1.id,
        },
      },
      user1,
    );

    assert.equal(
      response.errors?.[0].message,
      "Ticket does not require approval",
    );
  });
  it("It should throw an error if the ticket is not found", async () => {
    const user1 = await insertUser({
      isSuperAdmin: true,
    });
    const response = await executeGraphqlOperationAsUser<
      ApprovalUserTicketMutation,
      ApprovalUserTicketMutationVariables
    >(
      {
        document: ApprovalUserTicket,
        variables: {
          userTicketId: "123",
        },
      },
      user1,
    );

    assert.equal(response.errors?.[0].message, "Unauthorized!");
  });
});