/* eslint-disable */
/* @ts-nocheck */
/* prettier-ignore */
/* This file is automatically generated using `npm run graphql:types` */
import type * as Types from '../../generated/types';

import type { JsonObject } from "type-fest";
import gql from 'graphql-tag';
export type CancelUserTicketMutationVariables = Types.Exact<{
  userTicketId: Types.Scalars['String']['input'];
}>;


export type CancelUserTicketMutation = { __typename?: 'Mutation', cancelUserTicket: { __typename?: 'UserTicket', id: string, status: Types.TicketStatus, paymentStatus: Types.TicketPaymentStatus, approvalStatus: Types.TicketApprovalStatus, redemptionStatus: Types.TicketRedemptionStatus } };


export const CancelUserTicket = gql`
    mutation CancelUserTicket($userTicketId: String!) {
  cancelUserTicket(userTicketId: $userTicketId) {
    id
    status
    paymentStatus
    approvalStatus
    redemptionStatus
  }
}
    `;