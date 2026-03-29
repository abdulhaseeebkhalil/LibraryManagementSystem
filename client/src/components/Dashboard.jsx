import Navbar from "../components/Navbar";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl font-semibold">
          Welcome {user?.name} 👋
        </h2>

        <p className="mt-2 text-gray-600">
          You are logged in successfully.
        </p>
      </div>
    </>
  );
};

export default Dashboard;