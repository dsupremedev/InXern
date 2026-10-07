import React, { useState } from "react";

// Mirroring your exact algorithm from useListingDetails.ts
const calculateMatchScore = (
  requirements: {
    skill_id: string;
    requirement_type: "required" | "nice_to_have";
  }[],
  applicantSkillIds: string[],
) => {
  if (!requirements || requirements.length === 0) return 0;

  let totalWeight = 0;
  let earnedWeight = 0;

  requirements.forEach((req) => {
    const weight = req.requirement_type === "required" ? 2 : 1;
    totalWeight += weight;
    if (applicantSkillIds.includes(req.skill_id)) {
      earnedWeight += weight;
    }
  });

  return Math.round((earnedWeight / totalWeight) * 100);
};

export const MatchScoreTestRunner = () => {
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTestCases = () => {
    // Explicitly type the array to match the parameter's expected type
    const mockRequirements: {
      skill_id: string;
      requirement_type: "required" | "nice_to_have";
    }[] = [
      { skill_id: "react_id", requirement_type: "required" },
      { skill_id: "node_id", requirement_type: "required" },
      { skill_id: "typescript_id", requirement_type: "nice_to_have" },
    ];

    const testCases = [
      {
        name: "Test 1: Perfect Match (All Required + Nice-to-Have)",
        applicantSkills: ["react_id", "node_id", "typescript_id"],
        expected: 100,
      },
      {
        name: "Test 2: Only Required Skills Matched",
        applicantSkills: ["react_id", "node_id"],
        expected: 80,
      },
      {
        name: "Test 3: Partial Required + Nice-to-Have",
        applicantSkills: ["react_id", "typescript_id"],
        expected: 60,
      },
      {
        name: "Test 4: Only One Required Skill",
        applicantSkills: ["react_id"],
        expected: 40,
      },
      {
        name: "Test 5: Zero Matches",
        applicantSkills: ["python_id", "java_id"],
        expected: 0,
      },
    ];

    const results = testCases.map((tc) => {
      const score = calculateMatchScore(mockRequirements, tc.applicantSkills);
      return {
        ...tc,
        actualScore: score,
        passed: score === tc.expected,
      };
    });

    setTestResults(results);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Skills Match Score Test Suite
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Validates weighted matching logic (Required = 2pts, Nice-to-Have =
          1pt).
        </p>
      </div>

      <button
        onClick={runTestCases}
        className="px-5 py-2.5 bg-[#0F4C4C] hover:bg-[#1A6363] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
      >
        Run Test Cases
      </button>

      {testResults.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {testResults.map((res, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
                res.passed
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                  : "bg-red-50/50 border-red-200 text-red-900"
              }`}
            >
              <div className="space-y-1">
                <p className="font-bold">{res.name}</p>
                <p className="text-xs text-gray-500">
                  Expected: {res.expected}% | Got: {res.actualScore}%
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                  res.passed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {res.passed ? "Passed" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
