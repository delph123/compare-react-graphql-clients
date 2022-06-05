import { gql } from "@apollo/client";

export const GetUsers = gql`
    query GetUsers($filters: UserFilter, $nbFriends: Int!) {
        numberOfFriends @client @export(as: "nbFriends")
        users(filters: $filters) {
            id
            firstName
            lastName
            age
            type
            friends(max: $nbFriends) {
                id
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
        users(filters: { id: $userId }) {
            id
            firstName
            lastName
            age
            type
        }
    }
`;

export const GetFriends = gql`
    query GetFriends($userId: ID!, $nbFriends: Int!) {
        user(id: $userId) {
            id
            friends(max: $nbFriends) {
                id
                firstName
                lastName
                age
                type
            }
        }
    }
`;
