import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, CheckCheck, Megaphone, X } from "lucide-react";
import { authHeader } from "@/lib/auth";

import { API } from "@/lib/api";

export function NotificationBell() {
  const [avisos, setAvisos] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favo_read_notifications") || "[]");
    } catch {
      return [];
    }
  });
  const [openPopover, setOpenPopover] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(`${API}/avisos`, authHeader());
      setAvisos(res.data || []);
    } catch {
      // Fallback gracioso
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = avisos.filter((a) => !readIds.includes(a.id)).length;

  const markAllAsRead = () => {
    const allIds = avisos.map((a) => a.id);
    setReadIds(allIds);
    localStorage.setItem("favo_read_notifications", JSON.stringify(allIds));
  };

  const toggleRead = (id) => {
    let next;
    if (readIds.includes(id)) {
      next = readIds.filter((item) => item !== id);
    } else {
      next = [...readIds, id];
    }
    setReadIds(next);
    localStorage.setItem("favo_read_notifications", JSON.stringify(next));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenPopover(!openPopover)}
        className="relative p-2 rounded-full text-ink-2 hover:text-ink hover:bg-cream-2 transition-colors flex items-center justify-center focus:outline-none"
        title="Central de Notificações"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {openPopover && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-ink/10 shadow-2xl p-4 z-50 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between border-b border-ink/5 pb-2">
            <div className="flex items-center gap-2">
              <Megaphone size={16} className="text-amber" />
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-ink">
                Notificações & Avisos
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] text-amber hover:underline font-semibold flex items-center gap-1"
                >
                  <CheckCheck size={12} /> Lidas
                </button>
              )}
              <button
                onClick={() => setOpenPopover(false)}
                className="text-ink-3 hover:text-ink p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {avisos.map((item) => {
              const isRead = readIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleRead(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isRead
                      ? "bg-cream/40 border-ink/5 opacity-70"
                      : "bg-amber/5 border-amber/20 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber">
                      {item.categoria || "Aviso"}
                    </span>
                    <span className="text-[10px] text-ink-3">
                      {new Date(item.createdAt || Date.now()).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <h5 className="font-body font-bold text-xs text-ink">{item.titulo}</h5>
                  <p className="font-body text-[11px] text-ink-2 mt-0.5 line-clamp-2">
                    {item.texto}
                  </p>
                </div>
              );
            })}

            {avisos.length === 0 && (
              <p className="text-center py-6 text-xs text-ink-3">
                Nenhuma notificação no momento.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
