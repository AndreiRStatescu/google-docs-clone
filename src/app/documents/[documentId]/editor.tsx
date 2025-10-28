export const Editor = async ({ params }: { params: { documentId: string } }) => {
  const { documentId } = params;

  return (
    <div>
      <h1>Editor for Document ID: {documentId}</h1>
      <p>This is the editor page for document with ID: {documentId}</p>
    </div>
  );
};