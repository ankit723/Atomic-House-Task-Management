'use server'
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { gql } from 'graphql-tag';

const prisma = new PrismaClient();

// GraphQL Schema
const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    status: Status!
    createdAt: String!
    updatedAt: String!
  }

  enum Status {
    TODO
    IN_PROGRESS
    DONE
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!, description: String, status: Status): Task
    updateTask(id: ID!, title: String, description: String, status: Status): Task
    deleteTask(id: ID!): Boolean
  }
`;

enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

const resolvers = {
  Query :{
    task: async (_:any, { id }:any) => {
      if (id) {
        return await prisma.task.findUnique({
          where: { id },
        });
      } else {
        return await prisma.task.findMany();
      }
    },
    tasks: async () => {
      return await prisma.task.findMany();
    },
  },  
  Mutation: {
    createTask: async (_: any, { title, description, status }: { title: string; description?: string, status?: Status }) => {
      return await prisma.task.create({
        data: {
          title,
          description,
          status: status?status:'TODO',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    },
    updateTask: async (
      _: any,
      { id, title, description, status }: { id: string; title?: string; description?: string; status?: string }
    ) => {
      return await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          updatedAt: new Date(),
        },
      });
    },
    deleteTask: async (_: any, { id }: { id: string }) => {
      await prisma.task.delete({ where: { id } });
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const GET = startServerAndCreateNextHandler(server);
export const POST = startServerAndCreateNextHandler(server);





