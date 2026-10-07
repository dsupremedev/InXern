import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const AdminSkillsPage = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      setSkills(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setError(null);
    setSuccessMsg(null);

    const { error: insertError } = await supabase
      .from("skills")
      .insert([{ name: newSkillName.trim() }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setNewSkillName("");
      setSuccessMsg("Skill added successfully!");
      fetchSkills();
    }
  };

  // Rule: Cannot delete/deactivate if it has live references in listings or applicant profiles
  const handleRemoveSkill = async (skillId: string, skillName: string) => {
    setError(null);
    setSuccessMsg(null);

    // 1. Check live listing requirements
    const { count: listingCount, error: lError } = await supabase
      .from("listing_requirements")
      .select("*", { count: "exact", head: true })
      .eq("skill_id", skillId);

    // 2. Check live candidate/applicant profiles
    const { count: applicantCount, error: aError } = await supabase
      .from("applicant_skills")
      .select("*", { count: "exact", head: true })
      .eq("skill_id", skillId);

    if (lError || aError) {
      setError("Failed to verify live skill references.");
      return;
    }

    if (
      (listingCount && listingCount > 0) ||
      (applicantCount && applicantCount > 0)
    ) {
      setError(
        `Cannot remove "${skillName}": It has active references (${listingCount || 0} listings, ${applicantCount || 0} candidate profiles).`,
      );
      return;
    }

    // Safe to delete if zero references
    const { error: deleteError } = await supabase
      .from("skills")
      .delete()
      .eq("id", skillId);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setSuccessMsg(`Skill "${skillName}" removed successfully.`);
      setSkills(skills.filter((s) => s.id !== skillId));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Master Skills
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Add global categories. Skills with live candidate or listing
          references are strictly protected from removal.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm leading-relaxed">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm leading-relaxed">
          {successMsg}
        </div>
      )}

      {/* Add Skill Form */}
      <form
        onSubmit={handleAddSkill}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4"
      >
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          placeholder="Enter new skill name (e.g., GraphQL, PostgreSQL)..."
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] text-sm text-gray-800"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#0F4C4C] hover:bg-[#1A6363] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          Add Skill
        </button>
      </form>

      {/* Skills Table */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">
          Loading master skills...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase text-gray-400 tracking-wider">
                <th className="p-4">Skill Name</th>
                <th className="p-4 text-right">Protected Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {skills.map((skill) => (
                <tr
                  key={skill.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-900">
                    {skill.name}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleRemoveSkill(skill.id, skill.name)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove / Check Refs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
