"use client";

import * as React from "react";
import { Job, TaskItem } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatTime, cn } from "@/lib/utils";
import {
  Clock,
  Camera,
  CheckSquare,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";

interface InProgressStateProps {
  job: Job;
  elapsedSeconds: number;
  completedTaskIds: string[];
  localPhotos: File[];
  technicianNotes: string;
  onTaskToggle: (taskId: string) => void;
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (index: number) => void;
  onNotesChange: (notes: string) => void;
  onComplete: () => void;
}

export function InProgressState({
  job,
  elapsedSeconds,
  completedTaskIds,
  localPhotos,
  technicianNotes,
  onTaskToggle,
  onAddPhoto,
  onRemovePhoto,
  onNotesChange,
  onComplete,
}: InProgressStateProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [photoUrls, setPhotoUrls] = React.useState<string[]>([]);

  // Create object URLs for local photos
  React.useEffect(() => {
    const urls = localPhotos.map((file) => URL.createObjectURL(file));
    setPhotoUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [localPhotos]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddPhoto(file);
      // Reset input to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const allTasksCompleted =
    job.tasks.length > 0 && completedTaskIds.length === job.tasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Tabs Content */}
      <Tabs defaultValue="tasks" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="tasks" className="gap-1.5">
              <CheckSquare className="h-4 w-4" strokeWidth={2.5} />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="photos" className="gap-1.5">
              <ImageIcon className="h-4 w-4" strokeWidth={2.5} />
              Photos
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5">
              <FileText className="h-4 w-4" strokeWidth={2.5} />
              Notes
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {completedTaskIds.length} of {job.tasks.length} completed
              </span>
              {allTasksCompleted && (
                <span className="text-green-600 font-medium">All done!</span>
              )}
            </div>

            {job.tasks.map((task) => (
              <TaskItemRow
                key={task.id}
                task={task}
                isCompleted={completedTaskIds.includes(task.id)}
                onToggle={() => onTaskToggle(task.id)}
              />
            ))}

            {job.tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                <p>No tasks assigned for this job</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-4">
            {/* Hidden file input for camera */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Add Photo Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full h-20 border-dashed gap-2"
              onClick={handleCameraClick}
            >
              <Camera className="h-6 w-6" strokeWidth={2} />
              <span>Add Photo</span>
            </Button>

            {/* Photo Grid */}
            {(photoUrls.length > 0 || job.photos.length > 0) && (
              <div className="grid grid-cols-2 gap-3">
                {/* Existing job photos */}
                {job.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.caption || "Job photo"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                      {photo.type}
                    </div>
                  </div>
                ))}

                {/* Local photos (not yet synced) */}
                {photoUrls.map((url, index) => (
                  <div
                    key={`local-${index}`}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemovePhoto(index)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-amber-500/90 text-white text-xs px-2 py-1 text-center">
                      Not synced
                    </div>
                  </div>
                ))}
              </div>
            )}

            {photoUrls.length === 0 && job.photos.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                <p>No photos yet</p>
                <p className="text-sm">Tap above to capture job photos</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-4">
            <Textarea
              placeholder="Add private notes about this job..."
              value={technicianNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              className="min-h-[200px]"
            />

            {/* Previous notes */}
            {job.notes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Previous Notes
                </h4>
                {job.notes.map((note) => (
                  <Card key={note.id}>
                    <CardContent className="pt-3">
                      <p className="text-sm">{note.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {note.timestamp.toLocaleString()}
                        {note.isPrivate && " (Private)"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Sticky Footer with Timer and Complete Button */}
      <div className="sticky bottom-0 bg-background border-t border-border safe-area-bottom">
        {/* Timer */}
        <div className="flex items-center justify-center gap-2 py-3 bg-violet-50 dark:bg-violet-950/30">
          <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" strokeWidth={2.5} />
          <span className="font-mono text-xl font-bold text-violet-600 dark:text-violet-400">
            {formatTime(elapsedSeconds)}
          </span>
        </div>

        {/* Complete Button */}
        <div className="p-4">
          <Button
            size="xl"
            variant="success"
            className="w-full gap-2"
            onClick={onComplete}
          >
            <CheckSquare className="h-6 w-6" strokeWidth={2.5} />
            Complete Job
          </Button>
        </div>
      </div>
    </div>
  );
}

// Task Item Row Component
function TaskItemRow({
  task,
  isCompleted,
  onToggle,
}: {
  task: TaskItem;
  isCompleted: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "transition-colors",
        isCompleted && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
      )}
    >
      <CardContent className="py-3 px-4">
        <label className="flex items-center gap-4 cursor-pointer">
          <Checkbox checked={isCompleted} onCheckedChange={onToggle} />
          <span
            className={cn(
              "flex-1 text-sm",
              isCompleted && "line-through text-muted-foreground"
            )}
          >
            {task.description}
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
