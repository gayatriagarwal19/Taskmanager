"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import Navbar from "../../components/Navbar";
import TaskCard, { Task } from "../../components/TaskCard";
import TaskForm from "../../components/TaskForm";
import FilterBar from "../../components/FilterBar";

const LIMIT = 6;

export default function TasksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("created_at_desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Statistics
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (page - 1) * LIMIT;
      
      // Parse sorting: e.g. "created_at_desc" -> sort_by="created_at", sort_order="desc"
      const lastUnderscore = sortValue.lastIndexOf("_");
      const sortBy = sortValue.substring(0, lastUnderscore);
      const sortOrder = sortValue.substring(lastUnderscore + 1);

      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (debouncedSearchQuery.trim()) {
        params.append("search", debouncedSearchQuery.trim());
      }
      params.append("sort_by", sortBy);
      params.append("sort_order", sortOrder);
      params.append("skip", String(skip));
      params.append("limit", String(LIMIT + 1));

      const endpoint = `/tasks/?${params.toString()}`;
      const data = await apiRequest(endpoint);

      if (data.length > LIMIT) {
        setHasMore(true);
        setTasks(data.slice(0, LIMIT));
      } else {
        setHasMore(false);
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedSearchQuery, sortValue]);

  const fetchStats = useCallback(async () => {
    try {
      const allTasks = await apiRequest("/tasks/?limit=100");
      const counts = { total: 0, pending: 0, inProgress: 0, completed: 0 };
      allTasks.forEach((t: Task) => {
        counts.total++;
        if (t.status === "completed") counts.completed++;
        else if (t.status === "in_progress") counts.inProgress++;
        else counts.pending++;
      });
      setStats(counts);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchStats();
    }
  }, [user, fetchTasks, fetchStats]);

  const handleCreateOrUpdate = async (taskData: {
    title: string;
    description: string | null;
    priority: number;
    due_date: string | null;
  }) => {
    try {
      if (selectedTask) {
        // Edit mode
        await apiRequest(`/tasks/${selectedTask.id}`, {
          method: "PATCH",
          body: JSON.stringify(taskData),
        });
      } else {
        // Create mode
        await apiRequest("/tasks/", {
          method: "POST",
          body: JSON.stringify(taskData),
        });
      }
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error("Failed to save task:", error);
      throw error;
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      // Optimized state update
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
      fetchStats();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const openCreateForm = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-text-muted text-sm font-semibold">
          Authenticating...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background bg-radial-glow pb-12 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">
        {/* Header section with Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
              Your Workspace
            </h1>
            <p className="text-text-muted mt-1.5 text-sm">
              Keep track of your projects and milestones
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="btn-premium text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-purple-500/10 cursor-pointer self-start md:self-auto"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", val: stats.total, border: "border-border-muted", text: "text-foreground" },
            { label: "Pending", val: stats.pending, border: "border-border-muted", text: "text-yellow-500 font-bold" },
            { label: "In Progress", val: stats.inProgress, border: "border-border-muted", text: "text-purple-500 font-bold" },
            { label: "Completed", val: stats.completed, border: "border-border-muted", text: "text-emerald-500 font-bold" },
          ].map((item, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-border-muted">
              <span className="text-[10px] uppercase tracking-wider font-bold text-text-muted block mb-1">
                {item.label}
              </span>
              <span className={`text-3xl font-black ${item.text}`}>{item.val}</span>
            </div>
          ))}
        </div>

        {/* Filter and Pagination controls */}
        <FilterBar
          currentStatus={statusFilter}
          onStatusChange={(status) => {
            setStatusFilter(status);
            setPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortValue={sortValue}
          onSortChange={(sort) => {
            setSortValue(sort);
            setPage(1);
          }}
          page={page}
          onPageChange={setPage}
          hasMore={hasMore}
        />

        {/* Tasks Grid / List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 glass-card border border-border-muted rounded-2xl" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card border border-border-muted rounded-2xl p-16 text-center animate-fade-in flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-input-bg border border-input-border flex items-center justify-center text-text-muted mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No tasks found</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto mb-6">
              {statusFilter !== "all" || debouncedSearchQuery.trim()
                ? "There are currently no tasks matching your search or filters."
                : "Get started by adding your very first task to this dashboard."}
            </p>
            {statusFilter === "all" && !debouncedSearchQuery.trim() && (
              <button
                onClick={openCreateForm}
                className="btn-premium text-white text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Get Started
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdateStatus={handleUpdateStatus}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal overlay */}
      {isFormOpen && (
        <TaskForm task={selectedTask} onSubmit={handleCreateOrUpdate} onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
