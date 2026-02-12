import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">ClimaSell</h1>
          <p className="text-xl text-gray-600">
            Empowering Farmers through Predictive Analytics & Market Savvy
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Weather Analytics</h2>
            <p className="text-gray-700">
              Real-time weather forecasts and climate insights to help you plan your farming activities.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Market Prices</h2>
            <p className="text-gray-700">
              Track crop prices and market trends to maximize your profits and reduce waste.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-3 text-primary">Direct Sales</h2>
            <p className="text-gray-700">
              Connect directly with buyers and consumers for transparent, fair trade.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link 
            href="/dashboard" 
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/market" 
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            View Market Prices
          </Link>
        </div>
      </div>
    </main>
  )
}
