import { useEffect, useState } from "react";
import { Check, Copy, User, Key, Activity, CreditCard } from "lucide-react";

interface Credential {
  apiKey: string;
  apiUrl: string;
  usageCount: number;
  availableUsageCount: number;
  updateCount: number;
  availableUpdateCount: number;
  createdAt: string;
  updatedAt: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  credits: number;
  creditUpdates: any[];
  createdAt: string;
  updatedAt: string;
  credential: Credential;
}

function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
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
    setTimeout(() => setCopiedField(null), 2000);
  };

  interface InfoItemProps {
    label: string;
    value: string | number;
    copyable?: boolean;
    field?: string;
  }

  const InfoItem = ({ label, value, copyable = false, field = "" }: InfoItemProps) => (
    <div className="mb-6">
      <div className="text-sm text-neutral-400 mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-white font-medium break-all">{value}</div>
        {copyable && (
          <button
            onClick={() => handleCopy(String(value), field)}
            className="text-sm text-blue-400 hover:text-blue-200 flex items-center gap-1 px-2 py-1 bg-neutral-700 rounded-md ml-2"
          >
            {copiedField === field ? (
              <>
                <Check className="w-3 h-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className="animate-pulse text-lg">Loading user data...</div>
      </div>
    );
  }

  const {
    id,
    email,
    name,
    credits,
    createdAt,
    updatedAt,
    credential,
  } = user;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-700">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <div className="flex items-center gap-3 bg-neutral-800 px-4 py-2 rounded-lg">
            <CreditCard className="text-blue-400" />
            <div>
              <span className="text-sm text-neutral-400">Available Credits</span>
              <p className="text-xl font-bold">{credits}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Info Card */}
          <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden lg:col-span-4">
            <div className="bg-neutral-700 px-6 py-4 flex items-center gap-3">
              <User className="text-blue-400" />
              <h2 className="text-xl font-semibold">Account Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1">
                <InfoItem label="Name" value={name} />
                <InfoItem label="Email" value={email} />
                <InfoItem label="User ID" value={id} copyable field="userId" />
                <InfoItem label="Registered" value={new Date(createdAt).toLocaleString()} />
                <InfoItem label="Last Updated" value={new Date(updatedAt).toLocaleString()} />
              </div>
            </div>
          </div>

          {/* API Credential Card */}
          <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden lg:col-span-8">
            <div className="bg-neutral-700 px-6 py-4 flex items-center gap-3">
              <Key className="text-blue-400" />
              <h2 className="text-xl font-semibold">API Credentials</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <InfoItem label="API Key" value={credential.apiKey} copyable field="apiKey" />
                  <InfoItem label="API URL" value={credential.apiUrl} copyable field="apiUrl" />
                  <InfoItem label="Created" value={new Date(credential.createdAt).toLocaleString()} />
                </div>
                
                <div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-neutral-700 p-4 rounded-lg">
                      <span className="text-sm text-neutral-400">API Calls</span>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">{credential.usageCount}</div>
                        <div className="text-sm text-neutral-400 mt-1">
                          of {credential.availableUsageCount} <span className="text-green-400">available</span>
                        </div>
                        <div className="w-full bg-neutral-600 h-2 rounded-full mt-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${Math.min((credential.usageCount / credential.availableUsageCount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-700 p-4 rounded-lg">
                      <span className="text-sm text-neutral-400">Updates</span>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">{credential.updateCount}</div>
                        <div className="text-sm text-neutral-400 mt-1">
                          of {credential.availableUpdateCount} <span className="text-green-400">available</span>
                        </div>
                        <div className="w-full bg-neutral-600 h-2 rounded-full mt-2">
                          <div 
                            className="bg-blue-400 h-2 rounded-full"
                            style={{ width: `${Math.min((credential.updateCount / credential.availableUpdateCount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Graph */}
          <div className="bg-neutral-800 rounded-xl shadow-lg overflow-hidden lg:col-span-12">
            <div className="bg-neutral-700 px-6 py-4 flex items-center gap-3">
              <Activity className="text-blue-400" />
              <h2 className="text-xl font-semibold">API Call Activity</h2>
            </div>
            <div className="p-6">
              <div className="w-full h-64 bg-neutral-700 bg-opacity-50 rounded-lg flex flex-col items-center justify-center text-neutral-400">
                <Activity className="w-12 h-12 mb-3 opacity-50" />
                <p>API usage graph will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;