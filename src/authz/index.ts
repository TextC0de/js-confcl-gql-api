/* eslint-disable @typescript-eslint/no-unused-vars */
import { PreExecutionRule, UnauthorizedError } from "@graphql-authz/core";
import { GraphqlContext } from "~/builder";

export class IsAuthenticated extends PreExecutionRule {
  error = new UnauthorizedError("User is not authenticated");
  public execute({ USER, DB }: GraphqlContext, fieldArgs: { id?: string }) {
    return !!USER;
  }
}

export class IsSameUser extends PreExecutionRule {
  error = new UnauthorizedError("Not authorized");
  public execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { id: string } },
  ) {
    if (!USER || !fieldArgs.input.id) {
      return false;
    }
    return USER.id === fieldArgs.input.id;
  }
}

export class IsTicketOwner extends PreExecutionRule {
  error = new UnauthorizedError("Not authorized");
  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { id: string } },
  ) {
    if (!USER || !fieldArgs.input.id) {
      return false;
    }
    const IsTicketOwner = await DB.query.userTicketsSchema.findFirst({
      where: (utc, { eq, and }) =>
        and(eq(utc.userId, USER.id), eq(utc.id, fieldArgs.input.id)),
    });
    return Boolean(IsTicketOwner);
  }
}
export class CanEditCommunity extends PreExecutionRule {
  error = new UnauthorizedError("User cannot edit community");

  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { id?: string },
  ) {
    if (!fieldArgs.id) {
      return false;
    }
    if (!USER) {
      return false;
    }
    const user = await DB.query.communitySchema.findFirst({
      with: {
        usersToCommunities: {
          where: (utc, { eq, and }) =>
            and(eq(utc.userId, USER.id), eq(utc.role, "admin")),
        },
      },
    });
    return Boolean(user);
  }
}

export class IsSuperAdmin extends PreExecutionRule {
  public execute({ USER }: GraphqlContext, fieldArgs: { id?: string }) {
    if (!USER) {
      return false;
    }
    return Boolean(USER.isSuperAdmin);
  }
}

export class CanCreateEvent extends PreExecutionRule {
  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { communityId: string } },
  ) {
    if (!USER || !fieldArgs?.input?.communityId) {
      return false;
    }
    const user = await DB.query.usersToCommunitiesSchema.findFirst({
      where: (utc, { eq, and }) =>
        and(eq(utc.userId, USER.id), eq(utc.role, "admin")),
    });

    return Boolean(user);
  }
}

export class isCommunityCollaborator extends PreExecutionRule {
  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { communityId: string } },
  ) {
    if (!USER || !fieldArgs?.input?.communityId) {
      return false;
    }
    const user = await DB.query.communitySchema.findFirst({
      with: {
        usersToCommunities: {
          where: (utc, { eq, and }) =>
            and(eq(utc.userId, USER.id), eq(utc.role, "admin")),
        },
      },
    });
    return Boolean(user);
  }
}

export class isCommunityAdmin extends PreExecutionRule {
  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { communityId: string } },
  ) {
    if (!USER || !fieldArgs?.input?.communityId) {
      return false;
    }
    const isCommunityAdmin = await DB.query.usersToCommunitiesSchema.findFirst({
      where: (utc, { eq, and }) =>
        and(
          eq(utc.communityId, fieldArgs.input.communityId),
          eq(utc.userId, USER.id),
          eq(utc.role, "admin"),
        ),
    });

    return Boolean(isCommunityAdmin);
  }
}

export class isEventAdmin extends PreExecutionRule {
  public async execute(
    { USER, DB }: GraphqlContext,
    fieldArgs: { input: { eventId: string } },
  ) {
    if (!USER || !fieldArgs?.input?.eventId) {
      return false;
    }
    const isEventAdmin = await DB.query.eventsToUsersSchema.findFirst({
      where: (utc, { eq, and }) =>
        and(
          eq(utc.eventId, fieldArgs.input.eventId),
          eq(utc.userId, USER.id),
          eq(utc.role, "admin"),
        ),
    });

    return Boolean(isEventAdmin);
  }
}
