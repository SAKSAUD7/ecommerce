export default function Page() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">Inventory Management</h1>
          <p className="text-[#6d7175] text-sm mt-1">Track and adjust stock levels.</p>
        </div>
      </div>
      
      <div className="bg-white border border-[#e1e3e5] rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">Inventory Management is coming soon</h3>
        <p className="text-[#6d7175] text-sm max-w-md mx-auto">
          This module is part of the Aura OS expansion. The UI shell is in place and the backend connection will be activated in an upcoming sprint.
        </p>
      </div>
    </div>
  )
}
