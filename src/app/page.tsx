"use client";

import { useEffect, useMemo, useState } from "react";
import type { Advocate } from "./types";

const STEP = 10;
const MAX_LIMIT = 30;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(STEP);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        fetch("/api/advocates?limit=" + limit).then((response) => {
          response.json().then((jsonResponse) => {
            setAdvocates(jsonResponse.data);
          });
        });
      } catch (err) {
        if (!cancelled) console.log(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  const filteredAdvocates = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return advocates;
    return advocates.filter((advocate) => {
      const first = advocate.firstName?.toLowerCase() ?? "";
      const last = advocate.lastName?.toLowerCase() ?? "";
      const city = advocate.city?.toLowerCase() ?? "";
      const degree = advocate.degree?.toLowerCase() ?? "";
      const specialties = Array.isArray(advocate.specialties)
        ? advocate.specialties.join(" ").toLowerCase()
        : "";
      return (
        first.includes(query) ||
        last.includes(query) ||
        city.includes(query) ||
        degree.includes(query) ||
        specialties.includes(query)
      );
    });
  }, [advocates, searchTerm]);

  const onResetClick = () => setSearchTerm("");

  return isLoading ? (
    "Loading..."
  ) : (
    <main
      style={{ margin: "24px" }}
      className="mx-auto max-w-32xl flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-bold">Solace Advocates</h1>
      <div className="flex gap-4">
        <input
          className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for advocates..."
          value={searchTerm}
        />
        <button
          className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          onClick={onResetClick}
        >
          Reset
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-600">
          Searching for: <span className="font-semibold">{searchTerm}</span>
        </p>
        <div style={{ marginTop: 16 }}>
          {filteredAdvocates.length > 0 || searchTerm !== "" ? (
            <span className="text-sm text-gray-600">
              Results: <b>{filteredAdvocates.length}&nbsp;</b>
            </span>
          ) : null}
          <label>
            <span className="text-sm text-gray-600">Page size:&nbsp;</span>
            <select
              value={limit}
              onChange={(e) =>
                setLimit(Math.min(Number(e.target.value), MAX_LIMIT))
              }
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {[10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left p-4 border-b border-black bg-gray-200 mb-4">
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                First Name
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                Last Name
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                City
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                Degree
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                Specialties
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                Years of Experience
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-700">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, i) => {
              return (
                <tr
                  key={advocate.id}
                  className={`text-left ${i % 2 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.firstName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.degree}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.specialties.map((s, i) => (
                      <div key={`${advocate.id}-specialty-${i}`}>{s}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {advocate.yearsOfExperience}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <a href={`tel:${advocate.phoneNumber}`}>
                      {advocate.phoneNumber}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
