import { Suspense } from "react";
import { Loading } from "@/components/Loading";
import DashboardPage from "./page.client";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardPage />
    </Suspense>
  );
}