import { destroySession, getUser } from "@/utils/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/login");
}

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="bg-white p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">
        NextJS Project Manager
      </div>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-gray-700">
              Tenant: <strong>{user.tenantId}</strong>
            </span>
            <span className="text-gray-700">
              User: <strong>{user.username}</strong>
            </span>
            <form action={logoutAction}>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Logout
              </button>
            </form>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
