import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout(props: PageLayoutProps) {
  return (
    <>
      <Navbar></Navbar>
      {props.children}
    </>
  );
}
