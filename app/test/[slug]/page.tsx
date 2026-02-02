import { ReactNode } from 'react';

type PageProps = {
  params: { slug: string };
};

export default function Page(props: PageProps) {
  return <h1>The slug is: {props.params.slug}</h1>;
}
