/* eslint-disable */
/* @ts-nocheck */
/* prettier-ignore */
/* This file is automatically generated using `npm run graphql:types` */
import type * as Types from '../../generated/types';

import type { JsonObject } from "type-fest";
import gql from 'graphql-tag';
export type ApprovalUserTicketMutationVariables = Types.Exact<{
  userTicketId: Types.Scalars['String']['input'];
}>;


export type ApprovalUserTicketMutation = { __typename?: 'Mutation', approvalUserTicket: { __typename?: 'UserTicket', id: string, status: Types.TicketStatus, approvalStatus: Types.TicketApprovalStatus, paymentStatus: Types.TicketPaymentStatus, redemptionStatus: Types.TicketRedemptionStatus } };


export const ApprovalUserTicket = gql`
    mutation ApprovalUserTicket($userTicketId: String!) {
  approvalUserTicket(userTicketId: $userTicketId) {
    id
    status
    approvalStatus
    paymentStatus
    redemptionStatus
  }
}
    `;