export default function UserNotRegisteredError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          User Not Registered
        </h1>
        <p className="text-gray-600 mb-6">
          You are not registered to use this application.
        </p>
        <p className="text-sm text-gray-500">
          Please contact the administrator to get access.
        </p>
      </div>
    </div>
  );
}
