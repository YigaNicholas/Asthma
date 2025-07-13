import React from "react";

export default function Testing() {
  const obj = {
    name: "Alice",
    age: 25,
    password: "secret",
    email: "alice@example.com"
  };

  const noReplacer = JSON.stringify(obj, null, 2);

  const arrayReplacer = JSON.stringify(obj, ["name", "age"], 2);

  const functionReplacer = JSON.stringify(
    obj,
    (key, value) => (key === "password" ? undefined : value),
    2
  );

  const transformReplacer = JSON.stringify(
    obj,
    (key, value) => (typeof value === "string" ? value.toUpperCase() : value),
    2
  );

  const wrongObjectReplacer = JSON.stringify(obj, { name: true, age: true }, 2);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">JSON.stringify replacer demo</h2>

      <section>
        <h3 className="font-semibold">1️⃣ No replacer (null)</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">{noReplacer}</pre>
      </section>

      <section>
        <h3 className="font-semibold">2️⃣ Array replacer ["name","age"]</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">{arrayReplacer}</pre>
      </section>

      <section>
        <h3 className="font-semibold">3️⃣ Function replacer (remove password)</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">{functionReplacer}</pre>
      </section>

      <section>
        <h3 className="font-semibold">4️⃣ Function replacer (uppercase strings)</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">{transformReplacer}</pre>
      </section>

      <section>
        <h3 className="font-semibold">5️⃣ Wrong replacer: object instead of array/function</h3>
        <pre className="bg-gray-100 p-2 text-sm overflow-auto">{wrongObjectReplacer}</pre>
        <p className="text-xs text-gray-600">⚠️ Notice: object replacer is ignored; everything appears.</p>
      </section>
    </div>
  );
}
