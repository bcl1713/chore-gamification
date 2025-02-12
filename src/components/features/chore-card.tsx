/**
 * File: /src/components/features/chore-card.tsx
 * Description: Card component for displaying chore information
 * Project: Household Chore Gamification System
 * Last Modified: 2025-02-10
 */

import { Chore } from "@/types";
import { Button } from "@/components/ui/button";

interface ChoreCardProps {
  chore: Chore;
  onComplete?: (id: string) => void;
}

export function ChoreCard({ chore, onComplete }: ChoreCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{chore.title}</h3>
      <p className="mt-2 text-gray-600">{chore.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">{chore.points} points</span>
        <Button
          onClick={() => onComplete?.(chore.id)}
          disabled={chore.completed}
        >
          {chore.completed ? "Completed" : "Complete"}
        </Button>
      </div>
    </div>
  );
}
