import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col bg-gray-100 p-4">
      <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is a sample Next.js application using TypeScript and Tailwind CSS.</p>
      <Button className="mt-8">Get Started</Button>
    </div>
  );
};

export default Home;