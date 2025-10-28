import { Editor } from "./editor";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  return (
    <div>
      <h1>Document ID: {documentId}</h1>
      <p>This is the page for document with ID: {documentId}</p>
      <Editor params={{ documentId }} />
    </div>
  );
};

export default DocumentIdPage;  