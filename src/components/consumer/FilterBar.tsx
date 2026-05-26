'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export interface FilterOptions {
  searchQuery: string
  maxDistance: number // in meters
  freshnessFilter: 'all' | 'fresh' | 'warning' | 'critical'
  priceRange: [number, number]
  sortBy: 'distance' | 'price' | 'freshness'
}

interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}

export default function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value })
  }

  const handleDistanceChange = (value: number) => {
    onFiltersChange({ ...filters, maxDistance: value })
  }

  const handleFreshnessChange = (value: FilterOptions['freshnessFilter']) => {
    onFiltersChange({ ...filters, freshnessFilter: value })
  }

  const handleSortChange = (value: FilterOptions['sortBy']) => {
    onFiltersChange({ ...filters, sortBy: value })
  }

  const resetFilters = () => {
    onFiltersChange({
      searchQuery: '',
      maxDistance: 5000,
      freshnessFilter: 'all',
      priceRange: [0, 100000],
      sortBy: 'distance',
    })
    setShowFilters(false)
  }

  const activeFiltersCount = [
    filters.maxDistance !== 5000,
    filters.freshnessFilter !== 'all',
    filters.sortBy !== 'distance',
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar & Filter Toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
          <Input
            type="search"
            placeholder="Cari makanan atau warung..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-11 h-12 bg-white border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl"
            aria-label="Cari produk"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative h-12 w-12 rounded-xl border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-500/50 transition-all flex items-center justify-center shrink-0 shadow-sm"
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-5 h-5 text-slate-600" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white p-0 shadow-sm">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel Card */}
      {showFilters && (
        <Card className="p-6 space-y-6 border border-slate-100 bg-white/95 shadow-md rounded-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Urutkan Berdasarkan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'distance', label: 'Jarak' },
                { value: 'price', label: 'Harga' },
                { value: 'freshness', label: 'Kesegaran' },
              ].map((option) => {
                const isActive = filters.sortBy === option.value
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                    className={`h-10 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10'
                        : 'border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50'
                    }`}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <label
              htmlFor="distance-slider"
              className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3"
            >
              Jarak Maksimal: <span className="text-emerald-600 font-extrabold">{(filters.maxDistance / 1000).toFixed(1)} km</span>
            </label>
            <input
              id="distance-slider"
              type="range"
              min="500"
              max="5000"
              step="500"
              value={filters.maxDistance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-2">
              <span>0.5 km</span>
              <span>5 km</span>
            </div>
          </div>

          {/* Freshness Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Filter Kesegaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'Semua', activeClass: 'border-slate-300 bg-slate-50 text-slate-700', inactiveClass: 'border-slate-200 text-slate-600 bg-white' },
                { value: 'fresh', label: 'Baru (< 4h)', activeClass: 'border-emerald-300 bg-emerald-50/50 text-emerald-700', inactiveClass: 'border-slate-100 text-slate-500 bg-slate-50/30' },
                { value: 'warning', label: 'Segar (4-8h)', activeClass: 'border-amber-300 bg-amber-50/50 text-amber-700', inactiveClass: 'border-slate-100 text-slate-500 bg-slate-50/30' },
                { value: 'critical', label: 'Last Call (> 8h)', activeClass: 'border-red-300 bg-red-50/50 text-red-700', inactiveClass: 'border-slate-100 text-slate-500 bg-slate-50/30' },
              ].map((option) => {
                const isActive = filters.freshnessFilter === option.value
                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleFreshnessChange(option.value as FilterOptions['freshnessFilter'])
                    }
                    className={`h-10 rounded-xl text-xs font-bold transition-all border ${
                      isActive ? `${option.activeClass} border-2` : `${option.inactiveClass} hover:bg-slate-50`
                    }`}
                  >
                    {option.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              className="flex-1 h-11 rounded-xl border-slate-200 text-xs font-bold text-slate-500 hover:text-[#FF4D4D] hover:bg-red-50/50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Reset Filter</span>
            </Button>
            <Button
              type="button"
              onClick={() => setShowFilters(false)}
              className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-emerald-500/10"
            >
              Terapkan
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
