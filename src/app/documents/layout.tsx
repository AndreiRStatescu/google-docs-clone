interface DocumentLayoutProps {
  children: React.ReactNode;
}

const DocumentLayout = async ({ children }: DocumentLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <nav className="w-full bg-red-500">Document Navbar</nav>
      {children}
    </div>
  );
};

export default DocumentLayout;