'use client'

import { useAppSelector } from '@/store/hooks'

export default function MarketOverview() {
  const { prices } = useAppSelector((state) => state.market)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Market Prices</h2>
      <div className="space-y-3">
        {prices.length === 0 ? (
          <p className="text-gray-600">No market data available yet</p>
        ) : (
          prices.map((price) => (
            <div key={price.id} className="flex justify-between border-b pb-2">
              <span className="font-medium">{price.crop_type}</span>
              <span className="text-primary">${price.price}/kg</span>
            </div>
          ))
        )}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Connect to Supabase to see live market data
      </p>
    </div>
  )
}
