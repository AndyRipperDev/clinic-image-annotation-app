import React from 'react';
import { useLoaderData } from 'react-router-dom';

export interface TestData {
  context: string;
  message: string;
}

export async function loader(): Promise<unknown> {
  const response = await fetch('http://localhost:5095/');
  return await response.json();
}

const Test = (): JSX.Element => {
  const data = useLoaderData() as TestData;

  return <div>{data?.message}</div>;
};

export default Test;
