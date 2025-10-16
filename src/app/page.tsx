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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <div>
        <h2>Search</h2>
        <p>
          Searching for: <span>{searchTerm}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button onClick={onResetClick}>Reset</button>
        {filteredAdvocates.length > 0 || searchTerm !== "" ? (
          <span>Results: {filteredAdvocates.length}</span>
        ) : null}
        <div style={{ marginTop: 16 }}>
          <label>
            Page size:&nbsp;
            <select
              value={limit}
              onChange={(e) =>
                setLimit(Math.min(Number(e.target.value), MAX_LIMIT))
              }
            >
              {[10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
        {/* <button onClick={onSearchClick}>Search</button> */}
      </div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => {
            return (
              <tr key={advocate.id}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, i) => (
                    <div key={`${advocate.id}-specialty-${i}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
