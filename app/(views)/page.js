import { redirect } from "next/navigation";
export default function Home() {
  redirect("/places");
  return <div className="">Mujy na dekho</div>;
}
