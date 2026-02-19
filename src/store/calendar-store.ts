import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

import type { CalendarEvent, CalendarView } from '@/types';

type CalendarState = {
   events: CalendarEvent[];
   currentDate: Date;
   currentView: CalendarView;

   // UI state
   isModalOpen: boolean;
   editingEventId: string | null;
   selectedSlot: Date | null;
};

type CalendarActions = {
   addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
   updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
   deleteEvent: (id: string) => void;

   setCurrentDate: (date: Date) => void;
   setCurrentView: (view: CalendarView) => void;

   goToday: () => void;
   goNext: () => void;
   goPrev: () => void;

   // UI
   openCreateModal: (slotDate: Date) => void;
   openEditModal: (eventId: string) => void;
   closeModal: () => void;
};

type CalendarStore = CalendarState & CalendarActions;

export const useCalendarStore = create<CalendarStore>()(
   persist(
      (set, get) => ({
         events: [],
         currentDate: new Date(),
         currentView: 'week',

         isModalOpen: false,
         editingEventId: null,
         selectedSlot: null,

         openCreateModal: (slotDate) =>
            set({
               isModalOpen: true,
               editingEventId: null,
               selectedSlot: slotDate,
            }),

         openEditModal: (eventId) =>
            set({
               isModalOpen: true,
               editingEventId: eventId,
               selectedSlot: null,
            }),

         closeModal: () =>
            set({
               isModalOpen: false,
               editingEventId: null,
               selectedSlot: null,
            }),

         addEvent: (data) =>
            set((state) => ({
               events: [
                  ...state.events,
                  {
                     ...data,
                     id: `event_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                  },
               ],
            })),

         updateEvent: (id, updates) =>
            set((state) => ({
               events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
            })),

         deleteEvent: (id) =>
            set((state) => ({
               events: state.events.filter((e) => e.id !== id),
            })),

         setCurrentDate: (date) => set({ currentDate: date }),
         setCurrentView: (view) => set({ currentView: view }),
         goToday: () => set({ currentDate: new Date() }),

         goNext: () => {
            const { currentView, currentDate } = get();
            const nextDate = {
               day: addDays(currentDate, 1),
               week: addWeeks(currentDate, 1),
               month: addMonths(currentDate, 1),
            }[currentView];

            set({ currentDate: nextDate });
         },

         goPrev: () => {
            const { currentView, currentDate } = get();
            const prevDate = {
               day: subDays(currentDate, 1),
               week: subWeeks(currentDate, 1),
               month: subMonths(currentDate, 1),
            }[currentView];

            set({ currentDate: prevDate });
         },
      }),
      {
         name: 'calendar-store',
         partialize: (state) => ({
            events: state.events,
         }),

         onRehydrateStorage: () => (state) => {
            if (!state) return;

            state.events = state.events.map((event) => ({
               ...event,
               start: new Date(event.start),
               end: new Date(event.end),
            }));
         },
      }
   )
);
