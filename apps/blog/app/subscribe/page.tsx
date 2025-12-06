"use client";

import { subscribe } from "@/app/actions/subscribe";
import { useActionState } from "react";
export default function SubscribePage() {
  const [state, formAction] = useActionState(subscribe, null);

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        뉴스레터 구독
      </h1>
      <form action={formAction} className="flex flex-col space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
             rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Subscribe
        </button>
      </form>
      {state && (
        <p
          className={`mt-4 ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.message}
        </p>
      )}
    </main>
  );
}
