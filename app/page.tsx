"use client";

import { useState } from "react";

export default function LabProtocolPage() {
  const [experimentType, setExperimentType] = useState("");
  const [labEquipment, setLabEquipment] = useState("");
  const [safetyLevel, setSafetyLevel] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [sampleCount, setSampleCount] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experimentType.trim()) {
      setError("Please describe the experiment type.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");
    const prompt = `Experiment Type: ${experimentType}
Available Lab Equipment: ${labEquipment}
Safety Level: ${safetyLevel}
Skill Level: ${skillLevel}
Sample Count: ${sampleCount}`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "hsl(38, 92%, 50%)" }}>
            AI Lab Protocol & Method Generator
          </h1>
          <p className="text-gray-400">
            Generate detailed laboratory protocols with step-by-step methods, materials lists, and troubleshooting guides.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Experiment Type *</label>
            <input value={experimentType} onChange={(e) => setExperimentType(e.target.value)} placeholder="e.g. PCR amplification, Cell culture passage, Western blot, Titration" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Available Lab Equipment</label>
            <textarea value={labEquipment} onChange={(e) => setLabEquipment(e.target.value)} placeholder="List available equipment: e.g. biosafety cabinet, centrifuge, spectrophotometer, autoclave..." rows={3} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Safety Level</label>
            <select value={safetyLevel} onChange={(e) => setSafetyLevel(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-500 transition-colors">
              <option value="">Select safety level</option>
              <option>BSL-1 (No significant risk)</option>
              <option>BSL-2 (Moderate risk, microbes require BSL-2)</option>
              <option>BSL-3 (High risk, airborne pathogens)</option>
              <option>Chemical Hazard (corrosive, flammable, toxic)</option>
              <option>Radiation Hazard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Required Skill Level</label>
            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-amber-500 transition-colors">
              <option value="">Select skill level</option>
              <option>Beginner (Undergraduate student)</option>
              <option>Intermediate (Lab technician, graduate student)</option>
              <option>Advanced (Postdoc, experienced researcher)</option>
              <option>Expert (Principal investigator, specialist)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Number of Samples</label>
            <input value={sampleCount} onChange={(e) => setSampleCount(e.target.value)} type="number" min="1" placeholder="e.g. 12" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors" />
          </div>
          {error && <p className="text-sm" style={{ color: "hsl(38, 92%, 50%)" }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "hsl(38, 92%, 45%)" }}>
            {loading ? "Generating Lab Protocol..." : "Generate Lab Protocol"}
          </button>
        </form>

        {output && (
          <div className="mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">{output}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
