'use client'

export default function SessionOverview() {
  const sessions = [
    { id: 1, patient: "John Doe", type: "Individual Therapy", time: "2:00 PM", duration: "50 min", status: "confirmed" },
    { id: 2, patient: "Jane Smith", type: "Couples Therapy", time: "3:30 PM", duration: "60 min", status: "confirmed" },
    { id: 3, patient: "Michael Brown", type: "Initial Consultation", time: "5:00 PM", duration: "90 min", status: "pending" },
  ]

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Today's Sessions</h2>
        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {sessions.length} sessions
        </span>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-medium text-sm">
                  {session.patient.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{session.patient}</p>
                <p className="text-sm text-slate-600">{session.type}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  session.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></span>
                <p className="text-blue-600 font-semibold">{session.time}</p>
              </div>
              <p className="text-xs text-slate-500">{session.duration}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="w-full btn-secondary text-center">
          View Full Schedule
        </button>
      </div>
    </div>
  )
}
