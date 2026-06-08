import React from 'react';
import { Bell } from 'lucide-react';

const NotificationPage = () => {
  return (
    <div className="w-full pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2 tracking-tight">Notifications</h1>
        <p className="text-zinc-500">Stay updated on your exploration progress and achievements.</p>
      </div>

      <div className="card text-center py-16">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-zinc-300" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">You're all caught up!</h3>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          There are no new notifications at the moment. We'll let you know when you earn new badges, hit milestones, or when your hidden gems are reviewed.
        </p>
      </div>
    </div>
  );
};

export default NotificationPage;
