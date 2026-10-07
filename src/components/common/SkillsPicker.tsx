import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export interface SkillRequirement {
  skill_id: string;
  skill_name?: string;
  requirement_type: "required" | "nice_to_have";
}

interface SkillsPickerProps {
  selectedSkills: SkillRequirement[];
  onChange: (skills: SkillRequirement[]) => void;
}

export const SkillsPicker: React.FC<SkillsPickerProps> = ({
  selectedSkills,
  onChange,
}) => {
  const [allSkills, setAllSkills] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name")
        .order("name");
      if (!error && data) {
        setAllSkills(data);
      }
      setLoading(false);
    };
    fetchSkills();
  }, []);

  const handleAddSkill = (skillId: string) => {
    const skillObj = allSkills.find((s) => s.id === skillId);
    if (!skillObj) return;

    // Check if already added
    if (selectedSkills.some((s) => s.skill_id === skillId)) return;

    onChange([
      ...selectedSkills,
      {
        skill_id: skillId,
        skill_name: skillObj.name,
        requirement_type: "required",
      },
    ]);
  };

  const handleTypeChange = (
    skillId: string,
    type: "required" | "nice_to_have",
  ) => {
    onChange(
      selectedSkills.map((s) =>
        s.skill_id === skillId ? { ...s, requirement_type: type } : s,
      ),
    );
  };

  const handleRemove = (skillId: string) => {
    onChange(selectedSkills.filter((s) => s.skill_id !== skillId));
  };

  if (loading)
    return (
      <div className="text-xs text-gray-400">Loading available skills...</div>
    );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-900">
        Listing Requirements & Skills
      </label>

      {/* Dropdown to select skills */}
      <select
        onChange={(e) => {
          if (e.target.value) {
            handleAddSkill(e.target.value);
            e.target.value = ""; // reset
          }
        }}
        defaultValue=""
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-gray-800 bg-white"
      >
        <option value="" disabled>
          -- Select a skill to add --
        </option>
        {allSkills.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>

      {/* Selected Skills List */}
      <div className="space-y-2">
        {selectedSkills.map((item) => {
          const skillInfo = allSkills.find((s) => s.id === item.skill_id);
          return (
            <div
              key={item.skill_id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100"
            >
              <span className="text-sm font-medium text-gray-800">
                {item.skill_name || skillInfo?.name || "Skill"}
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={item.requirement_type}
                  onChange={(e) =>
                    handleTypeChange(
                      item.skill_id,
                      e.target.value as "required" | "nice_to_have",
                    )
                  }
                  className="px-2 py-1 text-xs rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none"
                >
                  <option value="required">Required</option>
                  <option value="nice_to_have">Nice-to-Have</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(item.skill_id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
        {selectedSkills.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            No skills added yet. Select at least one required skill.
          </p>
        )}
      </div>
    </div>
  );
};
