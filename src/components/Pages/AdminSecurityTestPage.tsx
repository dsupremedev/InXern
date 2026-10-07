import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export const AdminSecurityTestsPage = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runSecurityChecks = async () => {
    setLoading(true);
    const results = [];

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        throw new Error(
          "You must be logged in as an admin to execute security tests.",
        );
      }

      // --- TEST 1: Role Escalation Prevention ---
      // Attempt to self-escalate the current user's profile role to 'platform_admin'
      const { error: roleEscalationError } = await supabase
        .from("profiles")
        .update({ role: "platform_admin" })
        .eq("id", authData.user.id);

      results.push({
        name: "Test 1: Role Escalation Guard",
        description:
          "Prevents non-admins or lower roles from modifying their profile role column.",
        passed: !!roleEscalationError, // Pass if Supabase RLS or constraints blocked it
        detail: roleEscalationError
          ? `Blocked successfully: ${roleEscalationError.message}`
          : "WARNING: Role update succeeded unexpectedly!",
      });

      // --- TEST 2: Self-Approval Prevention ---
      // Attempt to update an organization's status to 'approved' directly
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", authData.user.id)
        .single();

      if (profile?.organization_id) {
        const { error: selfApprovalError } = await supabase
          .from("organizations")
          .update({ status: "approved" })
          .eq("id", profile.organization_id);

        results.push({
          name: "Test 2: Org Self-Approval Guard",
          description:
            "Prevents organization admins from approving their own organization directly.",
          passed: !!selfApprovalError,
          detail: selfApprovalError
            ? `Blocked successfully: ${selfApprovalError.message}`
            : "WARNING: Direct status update succeeded unexpectedly!",
        });
      } else {
        results.push({
          name: "Test 2: Org Self-Approval Guard",
          description:
            "Prevents organization admins from approving their own organization directly.",
          passed: true,
          detail:
            "Skipped (Logged-in user is not linked to an organization record).",
        });
      }

      // --- TEST 3: Cross-Tenant Data Isolation ---
      // Attempt to query organizations where status is pending without admin privileges
      // (Or test inserting a listing tied to a different organization UUID)
      const fakeOrgId = "00000000-0000-0000-0000-000000000000";
      const { error: crossTenantError } = await supabase
        .from("listings")
        .insert([
          {
            org_id: fakeOrgId,
            title: "Unauthorized Listing",
            description: "Cross-tenant injection test",
            type: "job",
            deadline: new Date(Date.now() + 864000000).toISOString(),
            status: "draft",
          },
        ]);

      results.push({
        name: "Test 3: Cross-Tenant Insertion Guard",
        description:
          "Prevents creating listings under an unauthorized organization UUID.",
        passed: !!crossTenantError,
        detail: crossTenantError
          ? `Blocked successfully: ${crossTenantError.message}`
          : "WARNING: Cross-tenant insertion succeeded unexpectedly!",
      });
    } catch (err: any) {
      results.push({
        name: "Security Suite Execution",
        description: "General execution check",
        passed: false,
        detail: err.message,
      });
    } finally {
      setTestResults(results);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Security Test Suite
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Validates RLS boundaries against role escalation, self-approval, and
          cross-tenant leakage.
        </p>
      </div>

      <button
        onClick={runSecurityChecks}
        disabled={loading}
        className="px-5 py-2.5 bg-[#0F4C4C] hover:bg-[#1A6363] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm disabled:opacity-50"
      >
        {loading ? "Running Security Assertions..." : "Run Security Test Suite"}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {testResults.map((res, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col gap-2 text-sm ${
                res.passed
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-900"
                  : "bg-red-50/50 border-red-200 text-red-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-bold">{res.name}</p>
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
              <p className="text-xs text-gray-600">{res.description}</p>
              <p className="text-xs font-mono bg-white/80 p-2 rounded border border-gray-200/50">
                {res.detail}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
