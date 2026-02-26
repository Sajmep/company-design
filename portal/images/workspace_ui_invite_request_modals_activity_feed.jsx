import React, { useState } from "react";

// Workspace UI sketch (single-file React component using Tailwind CSS)
// Purpose: handoff-ready mock component showing Invite Modal, Request Modal, and Activity Feed.
// Notes for dev/designer: replace mock data with real endpoints, wire up file upload, and connect permissions.

export default function WorkspaceUI() {
  const [showInvite, setShowInvite] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [participants, setParticipants] = useState([
    { id: 1, name: "Aisha Khan", role: "Admin", company: "BuildCo", avatar: "AK" },
    { id: 2, name: "Mohammed Ali", role: "Reviewer", company: "Internal", avatar: "MA" },
    { id: 3, name: "Supplier X", role: "Supplier", company: "SupplyX", avatar: "SX" },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, text: "Aisha uploaded RFQ_v1.pdf", time: "2m ago" },
    { id: 2, text: "Mohammed requested an extension (3 days)", time: "8m ago" },
    { id: 3, text: "Supplier X submitted proposal #12", time: "1h ago" },
  ]);

  // Invite form state (local only for sketch)
  const [inviteForm, setInviteForm] = useState({ email: "", role: "Viewer", expiresIn: "7" });

  // Request form state
  const [requestForm, setRequestForm] = useState({ type: "Clarification", message: "", attachmentName: null });

  function sendInvite(e) {
    e.preventDefault();
    const id = Math.max(...participants.map((p) => p.id)) + 1;
    setParticipants((s) => [
      ...s,
      { id, name: inviteForm.email.split("@")[0], role: inviteForm.role, company: "Guest", avatar: inviteForm.email.charAt(0).toUpperCase() },
    ]);
    setActivities((s) => [{ id: Date.now(), text: `Invite sent to ${inviteForm.email} as ${inviteForm.role}`, time: "just now" }, ...s]);
    setShowInvite(false);
    setInviteForm({ email: "", role: "Viewer", expiresIn: "7" });
  }

  function sendRequest(e) {
    e.preventDefault();
    setActivities((s) => [
      { id: Date.now(), text: `Request (${requestForm.type}) submitted: ${truncate(requestForm.message, 80)}`, time: "just now" },
      ...s,
    ]);
    setShowRequest(false);
    setRequestForm({ type: "Clarification", message: "", attachmentName: null });
  }

  function truncate(str, n) {
    return str.length > n ? str.slice(0, n - 1) + "…" : str;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">RFQ: New Building Materials</h1>
            <p className="text-sm text-gray-500">Workspace · Private · Created by Aisha Khan</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRequest(true)}
              className="px-4 py-2 bg-white border rounded-md shadow-sm hover:shadow focus:outline-none"
            >
              Request Action
            </button>
            <button
              onClick={() => setShowInvite(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
            >
              Invite
            </button>
          </div>
        </header>

        <main className="grid grid-cols-3 gap-6">
          {/* Left column: RFQ details */}
          <section className="col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-3">Overview</h2>
              <p className="text-sm text-gray-600 mb-4">
                Uploads, clarifications, supplier submissions and all discussions related to this RFQ live in this workspace.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <Card label="Deadline" value="Nov 15, 2025" />
                <Card label="Budget" value="SAR 120,000" />
                <Card label="Status" value="Open for Bids" />
                <Card label="Submissions" value="12" />
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Files</h3>
                <ul className="divide-y rounded-md border">
                  <li className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">RFQ_v1.pdf</div>
                      <div className="text-xs text-gray-500">Uploaded by Aisha · 2 days ago</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-sm px-3 py-1 border rounded">Download</button>
                      <button className="text-sm px-3 py-1 border rounded">History</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium mb-2">Discussion</h3>
              <div className="text-sm text-gray-600">Threaded comments and clarifications will appear here — each request creates a comment and a task for admins.</div>
            </div>
          </section>

          {/* Right column: Participants + Activity feed */}
          <aside>
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Participants</h4>
                <span className="text-xs text-gray-500">{participants.length}</span>
              </div>

              <ul className="space-y-3">
                {participants.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">{p.avatar}</div>
                      <div>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.role} · {p.company}</div>
                      </div>
                    </div>
                    <div className="text-xs">
                      <button className="px-2 py-1 rounded border text-xs">Manage</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 text-center">
                <button onClick={() => setShowInvite(true)} className="text-sm px-3 py-2 border rounded">Invite someone</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Activity</h4>
                <button className="text-xs text-gray-500">Filter</button>
              </div>

              <div className="space-y-3 max-h-64 overflow-auto">
                {activities.map((a) => (
                  <div key={a.id} className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                    <div className="font-medium">{a.text}</div>
                    <div className="text-xs text-gray-400">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <Modal onClose={() => setShowInvite(false)}>
          <div className="p-6 w-[520px]">
            <h3 className="text-lg font-semibold mb-2">Invite to Workspace</h3>
            <p className="text-sm text-gray-500 mb-4">Send an invite link or email. Guest access can be set to expire.</p>

            <form onSubmit={sendInvite} className="space-y-4">
              <div>
                <label className="text-xs font-medium">Email</label>
                <input
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((s) => ({ ...s, email: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="name@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium">Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm((s) => ({ ...s, role: e.target.value }))}
                    className="mt-1 w-full border rounded px-3 py-2"
                  >
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Reviewer</option>
                    <option>Admin</option>
                    <option>Supplier</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium">Expires (days)</label>
                  <input
                    type="number"
                    value={inviteForm.expiresIn}
                    onChange={(e) => setInviteForm((s) => ({ ...s, expiresIn: e.target.value }))}
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Send Invite</button>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-500">Tip: Use 'Supplier' for external bidding parties with limited access.</div>
          </div>
        </Modal>
      )}

      {/* Request Modal */}
      {showRequest && (
        <Modal onClose={() => setShowRequest(false)}>
          <div className="p-6 w-[520px]">
            <h3 className="text-lg font-semibold mb-2">Create Request</h3>
            <p className="text-sm text-gray-500 mb-4">Suppliers and participants can request actions — these route to Admins for approval.</p>

            <form onSubmit={sendRequest} className="space-y-4">
              <div>
                <label className="text-xs font-medium">Request type</label>
                <select
                  value={requestForm.type}
                  onChange={(e) => setRequestForm((s) => ({ ...s, type: e.target.value }))}
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  <option>Clarification</option>
                  <option>Extension</option>
                  <option>Upload Revision</option>
                  <option>Withdraw</option>
                  <option>Approval</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium">Message</label>
                <textarea
                  value={requestForm.message}
                  onChange={(e) => setRequestForm((s) => ({ ...s, message: e.target.value }))}
                  rows={4}
                  className="mt-1 w-full border rounded px-3 py-2"
                  placeholder="Describe the request and attach files if needed"
                />
              </div>

              <div>
                <label className="text-xs font-medium">Attachment</label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="file"
                    onChange={(e) => setRequestForm((s) => ({ ...s, attachmentName: e.target.files?.[0]?.name || null }))}
                    className="text-sm"
                  />
                  <div className="text-xs text-gray-500">{requestForm.attachmentName ?? "No file selected"}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowRequest(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit Request</button>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-500">Requests create an audit trail and can be converted to tasks by Admins.</div>
          </div>
        </Modal>
      )}
    </div>
  );
}


function Card({ label, value }) {
  return (
    <div className="p-3 rounded border bg-white">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
