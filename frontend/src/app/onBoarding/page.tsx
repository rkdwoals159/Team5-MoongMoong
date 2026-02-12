import { redirect } from "next/navigation";

import { createPet } from "./_api";

export default async function OnBoardingPage() {
  await createPet();
  redirect("/dashboard");
}
