import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  console.log('fetcher');
  console.log('endpoint', endpoint);
  console.log('requestInit', requestInit);
  console.log('query', query);
  console.log('variables', variables);
  console.log('requestInit.headers', requestInit.headers);
  console.log('JSON.stringify({ query, variables })', JSON.stringify({ query, variables }));
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        ...(requestInit.headers || {}),
      },
      body: JSON.stringify({ query, variables }),
    });


    const json = await res.json();


    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask?: Maybe<Task>;
  deleteTask?: Maybe<Scalars['Boolean']['output']>;
  updateTask?: Maybe<Task>;
};


export type MutationCreateTaskArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationDeleteTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateTaskArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status?: InputMaybe<Status>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  tasks: Array<Task>;
};

export enum Status {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status: Status;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CreateTaskMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTaskMutation = { __typename?: 'Mutation', createTask?: { __typename?: 'Task', id: string, title: string, description?: string | null, status: Status, createdAt: string, updatedAt: string } | null };

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'Mutation', deleteTask?: boolean | null };

export type UpdateTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Status>;
}>;


export type UpdateTaskMutation = { __typename?: 'Mutation', updateTask?: { __typename?: 'Task', id: string, title: string, description?: string | null, status: Status, createdAt: string, updatedAt: string } | null };

export type GetTasksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTasksQuery = { __typename?: 'Query', tasks: Array<{ __typename?: 'Task', id: string, title: string, description?: string | null, status: Status, createdAt: string, updatedAt: string }> };



export const CreateTaskDocument = `
    mutation CreateTask($title: String!, $description: String, $status: Status) {
  createTask(title: $title, description: $description, status: $status) {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
}
    `;

export const useCreateTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<CreateTaskMutation, TError, CreateTaskMutationVariables, TContext>
    ) => {
    
    return useMutation<CreateTaskMutation, TError, CreateTaskMutationVariables, TContext>({
      mutationKey: ['CreateTask'],
      mutationFn: (variables?: CreateTaskMutationVariables) => fetcher<CreateTaskMutation, CreateTaskMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CreateTaskDocument, variables)(),
      ...options
    })};

export const DeleteTaskDocument = `
    mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}
    `;

export const useDeleteTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<DeleteTaskMutation, TError, DeleteTaskMutationVariables, TContext>
    ) => {
    
    return useMutation<DeleteTaskMutation, TError, DeleteTaskMutationVariables, TContext>({
      mutationKey: ['DeleteTask'],
      mutationFn: (variables?: DeleteTaskMutationVariables) => fetcher<DeleteTaskMutation, DeleteTaskMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, DeleteTaskDocument, variables)(),
      ...options
    })};

export const UpdateTaskDocument = `
    mutation UpdateTask($id: ID!, $title: String, $description: String, $status: Status) {
  updateTask(id: $id, title: $title, description: $description, status: $status) {
    id
    title
    description
    status
    createdAt
    updatedAt
  }
}
    `;

export const useUpdateTaskMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<UpdateTaskMutation, TError, UpdateTaskMutationVariables, TContext>
    ) => {
    
    return useMutation<UpdateTaskMutation, TError, UpdateTaskMutationVariables, TContext>({
      mutationKey: ['UpdateTask'],
      mutationFn: (variables?: UpdateTaskMutationVariables) => fetcher<UpdateTaskMutation, UpdateTaskMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, UpdateTaskDocument, variables)(),
      ...options
    })};

export const GetTasksDocument = `
  query GetTasks {
    tasks {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const GetTaskDocument = `
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      createdAt
      updatedAt
    }
  }
`;

export const useGetTasksQuery = <
  TData = GetTasksQuery,
  TError = unknown
>(
  dataSource: { endpoint: string; fetchParams?: RequestInit },
  variables?: GetTasksQueryVariables,
  options?: UseQueryOptions<TData, TError>
) => {
  return useQuery<TData, TError>({
    queryKey: variables === undefined ? ['GetTasks'] : ['GetTasks', variables],
    queryFn: fetcher<GetTasksQuery, GetTasksQueryVariables>(
        dataSource.endpoint,
        dataSource.fetchParams || {},
        variables?GetTaskDocument: GetTasksDocument,
        variables
      ),
    ...options,
  });
};



  
