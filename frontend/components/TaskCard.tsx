"use client";

import React from "react";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string; // pending, in_progress, completed
  priority: number; // 1-5
  due_date?: string;
  created_at: string;
}

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: number, status: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onUpdateStatus, onEdit, onDelete }: TaskCardProps) {
  const getPriorityInfo = (p: number) => {
    switch (p) {
      case 1:
        return { label: "High", className: "priority-badge-1" };
      case 2:
        return { label: "Medium High", className: "priority-badge-2" };
      case 3:
        return { label: "Medium", className: "priority-badge-3" };
      case 4:
        return { label: "Medium Low", className: "priority-badge-4" };
      default:
        return { label: "Low", className: "priority-badge-5" };
    }
  };

  const priority = getPriorityInfo(task.priority);

  const getStatusColor = (s: string) => {
    switch (s) {
      case "completed":
        return "border-emerald-900/30 bg-emerald-950/10";
      case "in_progress":
        return "border-purple-900/30 bg-purple-950/10";
      default:
        return "border-zinc-800/80 bg-zinc-900/20";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getDueDateClass = (dateStr: string, status: string) => {
    if (status === "completed") {
      return "completed-date";
    }
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    
    const dueStr = dateStr.substring(0, 10);
    
    if (dueStr < todayStr) {
      return "overdue-date";
    } else if (dueStr === todayStr) {
      return "due-today-date";
    }
    return "text-text-muted";
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-6 border flex flex-col justify-between h-full transition-all duration-300 animate-fade-in ${getStatusColor(
        task.status
      )}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          {/* Priority Badge */}
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priority.className}`}>
            {priority.label}
          </span>

          {/* Quick status controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateStatus(task.id, "pending")}
              title="Set to Pending"
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                task.status === "pending"
                  ? "bg-foreground border-foreground text-background font-bold"
                  : "border-border-muted text-text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              P
            </button>
            <button
              onClick={() => onUpdateStatus(task.id, "in_progress")}
              title="Set to In Progress"
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                task.status === "in_progress"
                  ? "bg-brand-purple border-brand-purple text-white font-bold"
                  : "border-border-muted text-text-muted hover:border-brand-purple hover:text-brand-purple"
              }`}
            >
              I
            </button>
            <button
              onClick={() => onUpdateStatus(task.id, "completed")}
              title="Set to Completed"
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                task.status === "completed"
                  ? "bg-emerald-500 border-emerald-500 text-white font-bold"
                  : "border-border-muted text-text-muted hover:border-emerald-500 hover:text-emerald-500"
              }`}
            >
              ✓
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3
          className={`text-lg font-bold tracking-tight text-foreground mb-2 transition-all ${
            task.status === "completed" ? "line-through text-text-muted/60 opacity-60" : ""
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p
            className={`text-sm text-text-muted leading-relaxed mb-4 line-clamp-3 ${
              task.status === "completed" ? "opacity-60" : ""
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-border-muted mt-auto flex items-center justify-between text-xs">
        {/* Due Date Indicator */}
        <div className={`flex items-center gap-1.5 font-medium ${
          task.due_date ? getDueDateClass(task.due_date, task.status) : "text-text-muted"
        }`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>
            {task.due_date ? formatDate(task.due_date) : "No due date"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-card-hover-bg border border-transparent hover:border-border-muted transition-all cursor-pointer"
            title="Edit Task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
