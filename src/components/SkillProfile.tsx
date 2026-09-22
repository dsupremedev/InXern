import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import type { Database } from "../types/supabase";

export type Proficiency = "Beginner" | "Intermediate" | "Advanced";

// I need an interface for skills and selected skills
export interface skills {
  id: string;
  name: string;
}

export interface selectedSkill {
  skill_id: string;
  name: string;
  proficiency: Proficiency;
}

export const SkillProfile = () => {
  const [availableSkills, setAvailableSkills] = useState<skills[]>([]);
  const [activeSkills, setActiveSkills] = useState<skills | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<selectedSkill[]>([]);
  const [selectedProficiency, setSelectedProficiency] =
    useState<Proficiency>("Intermediate");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMasterSkills = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("skills")
          .select("id, name")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (fetchError) throw fetchError;

        if (data) {
          setAvailableSkills(data);
        }
      } catch (error: any) {
        console.error("Failed to fetch skill", error);
        setError("Failed to fetch skills, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchMasterSkills();
  }, []);

  //   I need to have a function that set the clicked skill to a state sthat tracks it.
  const manageClickedSkill = (skill: skills) => {
    const alreadySelected = selectedSkills.some((s) => s.skill_id === skill.id);
    if (alreadySelected) return;

    setActiveSkills(skill);

    setSelectedProficiency("Intermediate");
  };

  //   I need a function that runs when add to profile is clicked
  const manageAddSkills = () => {
    if (!activeSkills) return;

    const newSelectedSkills: selectedSkill = {
      skill_id: activeSkills.id,
      name: activeSkills.name,
      proficiency: selectedProficiency,
    };

    setSelectedSkills((prevData) => [...prevData, newSelectedSkills]);
    setActiveSkills(null);
  };

  //   I need a function that removes a skill form the skill set
  const manageSkillRemove = (skillIdRemove: string) => {
    setSelectedSkills((prevData) =>
      prevData.filter((s) => s.skill_id !== skillIdRemove),
    );
  };

  const manageSaveProfile = async () => {
    if (!user) {
      setError("You must be logged in to save your profile");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      //   I need to handle the delete from dataase
      const { error: deleteError } = await supabase
        .from("applicant_skills")
        .delete()
        .eq("applicant_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      if (selectedSkills.length > 0) {
        const rowsToInsert = selectedSkills.map((s) => ({
          applicant_id: user?.id,
          skill_id: s.skill_id,
          proficiency: s.proficiency,
        }));

        const { error: insertError } = await supabase
          .from("applicant_skills")
          .insert(rowsToInsert);
      }
      navigate("/browse");
    } catch (error: any) {
      console.error("Failed to save", error);
      setError("An error occured while saving your profile, please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-[#E0E0E0] p-6 sm:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            Build Your Skills Profile
          </h1>
          <p className="text-[#5C5C5C] mt-1 text-sm">
            Select the technical skills you possess. This will calculate your
            Skills Match Score for open roles.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-[#B3261E] rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Selected Skills Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
            Your Selected Skills ({selectedSkills.length})
          </h2>

          {selectedSkills.length === 0 ? (
            <p className="text-sm text-[#5C5C5C] italic bg-[#E6F0E6]/30 p-4 rounded-lg border border-[#E0E0E0]">
              No skills selected yet. Click on skills from the list below to add
              them to your profile.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((s) => (
                <div
                  key={s.skill_id}
                  className="flex items-center gap-2 bg-[#0F4C4C] text-white text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <span>{s.name}</span>
                  <span className="bg-[#1A6363] text-xs px-1.5 py-0.5 rounded text-[#E6F0E6]">
                    {s.proficiency}
                  </span>
                  <button
                    type="button"
                    onClick={() => manageSkillRemove(s.skill_id)}
                    className="ml-1 hover:text-[#C9A227] focus:outline-none"
                    aria-label={`Remove ${s.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Skill Proficiency Modal / Card */}
        {activeSkills && (
          <div className="mb-8 p-5 bg-[#E6F0E6]/40 border-2 border-[#0F4C4C] rounded-xl transition-all">
            <h3 className="text-md font-semibold text-[#0F4C4C] mb-2">
              Set Proficiency for{" "}
              <span className="underline">{activeSkills.name}</span>
            </h3>
            <p className="text-xs text-[#5C5C5C] mb-4">
              Select your self-reported proficiency level for this skill.
            </p>

            {/* Proficiency Radio Options */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(["Beginner", "Intermediate", "Advanced"] as Proficiency[]).map(
                (level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedProficiency(level)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      selectedProficiency === level
                        ? "bg-[#0F4C4C] text-white border-[#0F4C4C]"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:border-[#1A6363]"
                    }`}
                  >
                    {level}
                  </button>
                ),
              )}
            </div>

            {/* Action Buttons inside Card */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSkills(null)}
                className="px-4 py-2 text-xs text-[#5C5C5C] hover:text-[#1A1A1A]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={manageAddSkills}
                className="px-4 py-2 text-xs font-semibold bg-[#C9A227] text-[#1A1A1A] hover:bg-[#E0B93A] rounded-lg shadow-sm"
              >
                Add to Profile
              </button>
            </div>
          </div>
        )}

        {/* Master Catalog Skills Grid */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
            Available Tech Skills
          </h2>

          {loading ? (
            <div className="text-sm text-[#5C5C5C] py-4">
              Loading skills catalog...
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSkills.map((skill) => {
                const isSelected = selectedSkills.some(
                  (s) => s.skill_id === skill.id,
                );

                return (
                  <button
                    key={skill.id}
                    type="button"
                    disabled={isSelected}
                    onClick={() => manageClickedSkill(skill)}
                    className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                      isSelected
                        ? "bg-[#0F4C4C] text-white border-[#0F4C4C] opacity-50 cursor-not-allowed"
                        : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:border-[#0F4C4C] hover:bg-[#E6F0E6]/20"
                    }`}
                  >
                    {skill.name} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="pt-6 border-t border-[#E0E0E0] flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A]"
          >
            Skip for now
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={manageSaveProfile}
            className="px-6 py-2.5 bg-[#C9A227] hover:bg-[#E0B93A] text-[#1A1A1A] font-semibold text-sm rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};
