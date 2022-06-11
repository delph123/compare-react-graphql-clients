const express = require("express");
var cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  enum Type {
    ADMIN
    COMPUTER
    HUMAN
  }
  input UserFilter {
    uuid: String
    inUuids: [String]
    ageBelow: Int
    ageAbove: Int
    types: [Type]
  }
  type User {
    uuid: String
    firstName: String
    lastName: String
    age: Int
    type: Type
    friends(max: Int!): [User!]!
  }
  type Query {
    users(filters: UserFilter): [User]
    user(uuid: ID!): User
  }
`);

async function sleep(max, n) {
	const delay = random(max + 1, n) * 100;
	return new Promise((resolve, reject) => {
		setTimeout(resolve, delay);
	});
}

function random(max, number) {
	if (number != null) {
		return number % max;
	} else {
		return Math.floor(Math.random() * max);
	}
}

function pickOneOf(list, number) {
	return list[random(list.length, number)];
}

async function generateUser(number) {
	return {
		uuid: "user-" + number,
		firstName: pickOneOf(
			[
				"John",
				"Luc",
				"Jack",
				"Elie",
				"Leo",
				"Lea",
				"Julie",
				"Ralf",
				"Nick",
			],
			number
		),
		lastName: pickOneOf(
			[
				"Curd",
				"Voly",
				"Ramon",
				"Latif",
				"Trebor",
				"Balt",
				"Colve",
				"Volver",
			],
			number
		),
		age: random(37, number) + 18,
		type: pickOneOf(
			[
				"HUMAN",
				"HUMAN",
				"HUMAN",
				"HUMAN",
				"ADMIN",
				"COMPUTER",
				"COMPUTER",
			],
			number
		),
		friends: ({ max }) => generateMultiUser(max),
	};
}

async function generateMultiUser(numberOfUser) {
	await sleep(50, 20 * (numberOfUser % 2));
	return new Array(numberOfUser)
		.fill(0)
		.map(() => random(2000000000))
		.map(generateUser);
}

async function getUsers({
	filters: { uuid, inUuids, ageBelow, ageAbove, types },
}) {
	await sleep(30);
	let users = [];
	if (uuid) {
		users.push(await generateUser(uuid.substring(5)));
	} else {
		users = await Promise.all(
			new Array(50)
				.fill(0)
				.map((v, i) => i)
				.map(generateUser)
		);
	}
	if (inUuids) users = users.filter((u) => inUuids.includes(u.uuid));
	if (ageBelow) users = users.filter((u) => u.age <= ageBelow);
	if (ageAbove) users = users.filter((u) => u.age >= ageAbove);
	if (types) users = users.filter((u) => types.includes(u.type));
	return users;
}

async function getUser({ uuid }) {
	await sleep((5 * parseInt(uuid.substring(5))) % 3);
	return generateUser(uuid.substring(5));
}

// The root provides a resolver function for each API endpoint
var root = {
	users: getUsers,
	user: getUser,
};

var app = express();
app.use(cors());
app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
