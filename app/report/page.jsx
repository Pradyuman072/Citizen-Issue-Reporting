import IssueReportForm from "@/components/Form";

function FormPage() {
  return (
      <div className=" mx-auto bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Report a Civic Issue
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Help us improve your community by reporting issues you encounter.
        </p>
        <IssueReportForm />
      </div>

  );
}

export default FormPage;