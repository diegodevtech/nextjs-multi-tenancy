import { getSession, getUser } from "@/utils/session";
import { revalidatePath, revalidateTag } from "next/cache";
import Link from "next/link";

export async function getTasks(projectId: any) {
  const session = await getSession();
  const user = await getUser();
  const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
      "X-Tenant-Id": user!.tenantId,
    },
    cache: 'force-cache',
    next: {
      tags: [`project-${projectId}-tasks`]
    }
    // next: {
    //   revalidate: 10 //sec
    // }
  });

  return response.json();
}

export async function addTaskAction(formData: FormData) {
  'use server'

  const { projectId, title, description } = Object.fromEntries(formData);
  const session = await getSession();
  await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  // revalidatePath(`/projects/${projectId}/tasks`);
  revalidateTag(`project-${projectId}-tasks`);
}

export async function TasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const tasks = await getTasks(projectId);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 h-[calc(100vh-4.5rem)]">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Tasks</h1>
      <ul className="space-y-2 mb-6">
        {tasks.map((task: any) => (
          <li key={task.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
            <Link href={`/tasks/${task.id}`} className="text-blue-500 hover:underline">
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
      <form className="bg-white p-6 rounded-lg shadow-md" action={addTaskAction}>
        <input type="hidden" name="projectId" value={projectId} className="" />
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input className="w-full p-2 border border-gray-300 rounded-lg" name="title" type="text" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea className="w-full p-2 border border-gray-300 rounded-lg" name="description" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">Add Task</button>
      </form>
    </div>
  );
}

export default TasksPage;