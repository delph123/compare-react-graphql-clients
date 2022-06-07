import { gql } from "@apollo/client";

export const GetUsers = gql`
    query GetUsers($filters: UserFilter, $nbFriends: Int!) {
        numberOfFriends @client @export(as: "nbFriends")
        users(filters: $filters) {
            uuid
            firstName
            lastName
            age
            type
            friends(max: $nbFriends) {
                uuid
                firstName
                lastName
                age
                type
            }
        }
    }
`;

export const GetUser = gql`
    query GetUser($userId: String!) {
        users(filters: { uuid: $userId }) {
            uuid
            firstName
            lastName
            age
            type
        }
    }
`;

export const GetFriends = gql`
    query GetFriends($userId: ID!, $nbFriends: Int!) {
        user(uuid: $userId) {
            uuid
            friends(max: $nbFriends) {
                uuid
                firstName
                lastName
                age
                type
            }
        }
    }
`;
