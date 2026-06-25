"use client";

import React from "react";

interface FilterBarProps {
  currentStatus: string; // "all", "pending", "in_progress", "completed"
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortValue: string; // e.g. "created_at_desc", "due_date_asc", etc.
  onSortChange: (sortVal: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

export default function FilterBar({
  currentStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortValue,
  onSortChange,
  page,
  onPageChange,
  hasMore,
}: FilterBarProps) {
  const statuses = [
    { value: "all", label: "All Tasks" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const sortOptions = [
    { value: "created_at_desc", label: "Newest First" },
    { value: "created_at_asc", label: "Oldest First" },
    { value: "due_date_asc", label: "Due Date: Soonest First" },
    { value: "due_date_desc", label: "Due Date: Latest First" },
    { value: "priority_asc", label: "Priority: High to Low" },
    { value: "priority_desc", label: "Priority: Low to High" },
  ];

  return (
    <div className="flex flex-col gap-6 py-6 px-6 glass-card rounded-2xl border border-border-muted mb-8 animate-fade-in">
      {/* Top row: Search bar & Sort selector */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl pl-11 pr-4 py-2.5 text-sm text-foreground placeholder-text-muted/60 transition-all outline-none"
            placeholder="Search tasks by title or description..."
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider whitespace-nowrap hidden sm:block">
            Sort By
          </label>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full md:w-[220px] bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl px-4 py-2.5 text-sm text-foreground transition-all outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom row: Status filters & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-muted">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                currentStatus === s.value
                  ? "bg-foreground border-foreground text-background"
                  : "border-border-muted text-text-muted hover:border-foreground hover:text-foreground bg-input-bg"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-muted bg-input-bg hover:bg-card-hover-bg hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            &larr; Prev
          </button>
          <span className="text-xs font-bold text-text-muted">Page {page}</span>
          <button
            disabled={!hasMore}
            onClick={() => onPageChange(page + 1)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-muted bg-input-bg hover:bg-card-hover-bg hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
