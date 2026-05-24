'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import InputField from '@/components/ui/InputField'
import GlassPanel from '@/components/ui/GlassPanel'

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
        <div className="flex-1">
          <InputField
            type="search"
            placeholder="Cari makanan atau warung..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={<Search size={20} />}
            aria-label="Cari produk"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="relative px-4 py-3 rounded-xl bg-surface-container border border-outline/30 hover:border-accent-primary/50 transition-all focus-visible-ring flex items-center gap-2"
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-5 h-5 text-on-surface-variant" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent-primary text-bg-primary text-xs font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <GlassPanel className="space-y-6 animate-in slide-in-from-top-2 duration-200">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-3">
              Urutkan Berdasarkan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'distance', label: 'Jarak' },
                { value: 'price', label: 'Harga' },
                { value: 'freshness', label: 'Kesegaran' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSortChange(option.value as FilterOptions['sortBy'])}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all focus-visible-ring ${
                    filters.sortBy === option.value
                      ? 'bg-accent-primary text-bg-primary'
                      : 'bg-surface-container-high text-outline hover:text-accent-primary'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <label
              htmlFor="distance-slider"
              className="block text-sm font-semibold text-on-surface-variant mb-3"
            >
              Jarak Maksimal: {(filters.maxDistance / 1000).toFixed(1)} km
            </label>
            <input
              id="distance-slider"
              type="range"
              min="500"
              max="5000"
              step="500"
              value={filters.maxDistance}
              onChange={(e) => handleDistanceChange(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-accent-primary focus-visible-ring"
            />
            <div className="flex justify-between text-xs text-outline mt-2">
              <span>0.5 km</span>
              <span>5 km</span>
            </div>
          </div>

          {/* Freshness Filter */}
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-3">
              Filter Kesegaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'Semua', color: 'bg-surface-container-high' },
                { value: 'fresh', label: 'Baru (< 4h)', color: 'bg-fresh-mint/20 text-fresh-mint' },
                { value: 'warning', label: 'Segar (4-8h)', color: 'bg-warning-mint/20 text-warning-mint' },
                { value: 'critical', label: 'Last Call (> 8h)', color: 'bg-critical-red/20 text-critical-red' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handleFreshnessChange(option.value as FilterOptions['freshnessFilter'])
                  }
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all focus-visible-ring ${
                    filters.freshnessFilter === option.value
                      ? `${option.color} border-2 border-accent-primary`
                      : `${option.color} border border-outline/20`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-outline/20">
            <button
              type="button"
              onClick={resetFilters}
              className="flex-1 px-4 py-3 rounded-xl border border-outline/30 text-sm font-semibold text-outline hover:text-accent-primary hover:border-accent-primary/50 transition-all focus-visible-ring flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Reset Filter</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="flex-1 px-4 py-3 rounded-xl bg-accent-primary text-bg-primary text-sm font-semibold hover:brightness-110 transition-all focus-visible-ring"
            >
              Terapkan
            </button>
          </div>
        </GlassPanel>
      )}
    </div>
  )
}
