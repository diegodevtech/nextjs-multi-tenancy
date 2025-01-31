import { getSession, getUser } from "@/utils/session";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export async function getProjects() {
  const session = await getSession();
  const user = await getUser();
  const response = await fetch("http://localhost:8000/projects", {
    headers: {
      Authorization: `Bearer ${session.token}`,
      "X-Tenant-Id": user!.tenantId,
    },
  });

  return response.json();
}

export async function addProjectAction(formData: FormData) {
  "use server";

  const name = formData.get("name");
  const session = await getSession();
  await fetch("http://localhost:8000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ name }),
  });
  revalidatePath('/');
}

export async function DashboardPage() {
  const projects = await getProjects();
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 h-[calc(100vh-4.5rem)]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Projects</h1>
      <ul className="space-y-2 mb-6">
        {
          projects.map((project: any) => (
            <li key={project.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <Link 
                href={`/projects/${project.id}/tasks`}
                className="text-blue-500 hover:underline"
              > 
                {project.name}
              </Link>
            </li>
          ))
        }
      </ul>
      <form action={addProjectAction} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
          <input className="w-full p-2 border border-gray-300 rounded-lg" name="name" id="name" type="text" />
        </div>
        <button className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" type="submit">
          Add project
        </button>
      </form>
    </div>
  );
}

export default DashboardPage;
