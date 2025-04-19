import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react"; // Optional: use icons from lucide-react (or replace with emoji/icons)

function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userFormpilot");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000); // Reset after 2s
  };

  const InfoRow = ({ label, value, copyable = false, field = "" }: { label: string; value: string | number; copyable?: boolean; field?: string }) => (
    <div className="flex items-center justify-between gap-2">
      <p>
        <span className="font-semibold text-white">{label}:</span>{" "}
        <span className="text-neutral-300 break-all">{value}</span>
      </p>
      {copyable && (
        <button
          onClick={() => handleCopy(String(value), field)}
          className="text-sm text-blue-400 hover:text-blue-200 flex items-center gap-1"
        >
          {copiedField === field ? (
            <>
              <Check className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <p className="text-lg">Loading user data...</p>
      </div>
    );
  }

  const {
    id,
    email,
    name,
    credits,
    creditUpdates,
    createdAt,
    updatedAt,
    credential,
  } = user;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        {/* User Info */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold border-b border-neutral-600 pb-2">User Information</h2>
          <div className="space-y-3">
            <InfoRow label="Name" value={name} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="User ID" value={id} />
            <InfoRow label="Credits" value={credits} />
            <InfoRow label="Credit Updates" value={creditUpdates} />
            <InfoRow label="Created At" value={new Date(createdAt).toLocaleString()} />
            <InfoRow label="Updated At" value={new Date(updatedAt).toLocaleString()} />
          </div>
        </div>

        {/* Credential Info */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold border-b border-neutral-600 pb-2">API Credential</h2>
          <div className="space-y-3">
            <InfoRow label="API Key" value={credential.apiKey} copyable field="apiKey" />
            <InfoRow label="API URL" value={credential.apiUrl} copyable field="apiUrl" />
            <InfoRow label="Usage Count" value={credential.usageCount} />
            <InfoRow label="Available Usage" value={credential.availableUsageCount} />
            <InfoRow label="Update Count" value={credential.updateCount} />
            <InfoRow label="Available Updates" value={credential.availableUpdateCount} />
            <InfoRow label="Created At" value={new Date(credential.createdAt).toLocaleString()} />
            <InfoRow label="Updated At" value={new Date(credential.updatedAt).toLocaleString()} />
          </div>
        </div>

        {/* API Graph Placeholder */}
        <div className="bg-neutral-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">API Call Activity</h2>
          <div className="w-full h-64 bg-neutral-700 rounded-lg flex items-center justify-center text-neutral-400">
            Graph will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
