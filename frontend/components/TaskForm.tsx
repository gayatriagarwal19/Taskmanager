"use client";

import React, { useState, useEffect } from "react";
import { Task } from "./TaskCard";

interface TaskFormProps {
  task?: Task | null; // If present, we are editing
  onSubmit: (taskData: {
    title: string;
    description: string | null;
    priority: number;
    due_date: string | null;
  }) => Promise<void>;
  onClose: () => void;
}

export default function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      if (task.due_date) {
        // Format ISO date to YYYY-MM-DD for standard input type="date"
        const d = new Date(task.due_date);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        setDueDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setPriority(3);
      setDueDate("");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = dueDate ? new Date(dueDate).toISOString() : null;
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority: Number(priority),
        due_date: formattedDate,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card rounded-2xl p-8 z-10 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-foreground p-1.5 rounded-lg hover:bg-card-hover-bg transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
          {task ? "Edit Task" : "Create New Task"}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl px-4 py-3 text-sm text-foreground transition-all outline-none"
              placeholder="e.g. Design app UI"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl px-4 py-3 text-sm text-foreground transition-all outline-none h-28 resize-none"
              placeholder="Provide a short description of the task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl px-4 py-3 text-sm text-foreground transition-all outline-none"
              >
                <option value={1}>1 - High</option>
                <option value={2}>2 - Medium High</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - Medium Low</option>
                <option value={5}>5 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onClick={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {}
                }}
                onFocus={(e) => {
                  try {
                    e.currentTarget.showPicker();
                  } catch (err) {}
                }}
                className="w-full bg-input-bg border border-input-border focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/30 rounded-xl px-4 py-3 text-sm text-foreground transition-all outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-muted">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-foreground hover:bg-card-hover-bg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
