import { Button } from "@/components/ui/button";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col bg-gray-100 p-4">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">
        This is a sample Next.js application using TypeScript and Tailwind CSS.
      </p>
      <Button className="mt-8">Get Started</Button>
      <div className="mt-4">
        Click{" "}
        <Link href="/documents/123">
          <span className="text-blue-500 underline">here</span>
        </Link>{" "}
        to go to Documents 123 page.
      </div>
    </div>
  );
};

export default Home;
